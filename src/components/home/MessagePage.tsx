// external imports
import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
// internal imports
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { selectAppState, setClientSocket, setOnlineUsers, setSocketConnected, toggleRefresh } from '../../app/slices/AppSlice';
import MsgHeader from '../utils/MsgHeader';
import { setSelectedChat } from '../../app/slices/AppSlice';
import { displayDialog, setShowDialogActions } from '../../app/slices/CustomDialogSlice';
import ViewProfileBody from '../dialogs/ViewProfileBody';
import { setFetchMsgs } from '../../app/slices/AppSlice';
import { selectCurrentUser, setLoggedInUser } from '../../app/slices/auth/authSlice';
import LoadingMsgs from '../utils/LoadingMsgs';
import Message from '../utils/Message';
import MsgOptionsMenu from '../menus/MsgOptionsMenu';
import { displayToast } from '../../app/slices/ToastSlice';
import { FIVE_MB, getAxiosConfig, isImageOrGifFile, parseInnerHTML } from '../utils/appUtils';
import { setLoading } from '../../app/slices/LoadingSlice';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import { Box } from '@mui/material';
import io from 'socket.io-client'


let msgFileAlreadyExists = false;

const MessagePage = ({setDialogBody}:any) => {
  const dispatch=useAppDispatch()
  const theme=useAppSelector(selectTheme)
  const {selectedChat,fetchMsgs,clientSocket,isSocketConnected,refresh}:any=useAppSelector(selectAppState)
  const loggedinUser=useAppSelector(selectCurrentUser)
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [clickedMsgId, setClickedMsgId] = useState("");
  const [msgEditMode, setMsgEditMode] = useState(false);
  const [msgOptionsMenuAnchor, setMsgOptionsMenuAnchor] = useState(null);
  const editableMsgContent = useRef<any | null>(null);
  const [attachmentData, setAttachmentData] = useState<any | null>({ attachment: null, attachmentPreviewUrl: ""});
  const [msgFileRemoved, setMsgFileRemoved] = useState<boolean | any >(false);
  const [dontScrollToBottom, setDontScrollToBottom] = useState(false);
  const msgListBottom = useRef<any>(null);
  const [downloadingFileId, setDownloadingFileId] = useState("");
  const [loadingMediaId, setLoadingMediaId] = useState("");
  const SOCKET_ENDPOINT:any = process.env.API_URL;
  const msgFileInput = useRef<any | null>({});
  const [fileAttached, setFileAttached] = useState(false);
  const msgContent = useRef<any | null>(null);
  

// close select chat
  const close=()=>{
    setLoadingMsgs(false);
    dispatch(setSelectedChat(null));
  }

  const openViewProfileDialog = (props:any) => {
    dispatch(setShowDialogActions(false));
    setDialogBody(props? <ViewProfileBody {...props} />:<ViewProfileBody />);
    dispatch(displayDialog({ title: "View Profile" }));
  };


// notification update
const notificationUpdate=(notifications:any)=>{
  const notificationsUpdate=[...notifications]
 const updatedUser = {
   ...loggedinUser,
   notifications: notificationsUpdate?.reverse(),
 };
  dispatch(setLoggedInUser(updatedUser))
}


// displayError
const displayError = ( error:any = "Oops! Something went wrong", title = "Operation Failed") => {
  dispatch(
     displayToast({  title, message: error.response?.data?.message || error.message, type: "error",duration: 5000, positionVert: "bottom",positionHor:'center'})
  );
};

const selectAttachment = () => {
  msgFileInput.current?.click();
};

// reset Msg Input
const resetMsgInput = (options:any) => {
  setAttachmentData({
    attachment: null,
    attachmentPreviewUrl: "",
  });
  if(msgFileInput.current.value) msgFileInput.current.value = "";
  if (options?.discardAttachmentOnly) return;
  setFileAttached(false);
};




// fetch Messages start
   const fetchMessages=async(options?:any)=>{
    setLoadingMsgs(true);
    const config = getAxiosConfig({ loggedinUser });
    try {
      const { data } = await axios.get(
        `${process.env.API_URL}/api/message/${selectedChat?._id}`,
        config
      );
      setMessages(data.map((msg:any) => {msg["sent"] = true; return msg}));
  
      setLoadingMsgs(false);
      if (fetchMsgs) dispatch(setFetchMsgs(false));
      setSending(false);
    } 
    catch (error) {
      displayError(error, "Couldn't Fetch Messages");
      console.log(error);
      dispatch(setLoading(false));
      setSending(false);
    }
}
// fetch Messages end


// srool bottom start
const scrollToBottom = () => {
  msgListBottom.current?.scrollIntoView();
};
// srool bottom end


// open Msg Options Menu
const openMsgOptionsMenu = (e:any) => {
  if (sending) return;
  setMsgOptionsMenuAnchor(e.target);
};





// update message area
const updateMessage = async (updatedMsgContent:any, msgDate:any) => {

  if (!(attachmentData.attachment || (msgFileAlreadyExists && !msgFileRemoved)) && !parseInnerHTML(updatedMsgContent) ) {
    return dispatch( displayToast({ message: "A Message Must Contain Either a File or some Text Content", type: "warning", duration: 5000, positionVert: "top",positionHor:'center'}));
  }

  setMsgEditMode(false);
  setDontScrollToBottom(true)

  

  const msgData:any = { ...attachmentData,content: updatedMsgContent || ""};
  const isNonImageFile = !isImageOrGifFile(msgData.attachment?.name);

  const updatedMsg = {
    _id: Date.now(),
    sender: {
      _id: loggedinUser?._id,
      profilePic: "",
      name: "",
      email: "",
    },
    fileUrl: msgData?.attachmentPreviewUrl,
    file_id: "",
    file_name: msgData?.attachment?.name +
      `${  msgData?.mediaDuration  ? `===${msgData.mediaDuration}`  : isNonImageFile  ? `===${msgData.attachment?.size || ""}`: ""}`,
    content: msgData?.content,
    createdAt: msgDate,
    sent: false,
  };

  setMessages(messages.map((msg:any) => (msg._id === clickedMsgId ? updatedMsg : msg)));


  discardAttachment();
  setSending(true);

  const config = getAxiosConfig({ loggedinUser, formData: true });
  try {
    const apiUrl = isNonImageFile ? `${process.env.API_URL}/api/message/update-in-s3` : `${process.env.API_URL}/api/message/update`;
    const formData = new FormData();

    formData.append("attachment", msgData.attachment);
    formData.append("msgFileRemoved", msgFileRemoved); 
    formData.append("mediaDuration", msgData?.mediaDuration);
    formData.append("updatedContent", msgData.content);
    formData.append("messageId", clickedMsgId);
    const { data } = await axios.put(apiUrl, formData, config);
    if (isSocketConnected) clientSocket?.emit("msg updated", data);
    fetchMessages({ updatingMsg: true });

    dispatch(toggleRefresh(!refresh));
    setMsgFileRemoved(false);

  } catch (error) {
    console.log(error);
    displayError(error, "Couldn't Update Message");
    setSending(false);
    setMsgFileRemoved(false);
  }

}

// edit message
const editMsgHandler=()=>setMsgEditMode(true)

// delete message area start ---------------------------------------------------------------------------------------------------------------------------------------------------------
const deleteMessage= async()=>{
  dispatch(setLoading(true));
  setSending(true);
  const config = getAxiosConfig({ loggedinUser });
 
  try {
    await axios.put(`${process.env.API_URL}/api/message/delete`, { messageIds: JSON.stringify([clickedMsgId]) }, config );
    if (isSocketConnected) {
      clientSocket?.emit("msg deleted", {
        deletedMsgId: clickedMsgId,
        senderId: loggedinUser?._id,
        chat: selectedChat,
      });
    }
    dispatch(displayToast({ message:'message was deleted', type: "success", duration: 1500, positionVert: "bottom",positionHor:'center'}));
    setMessages(messages.filter((msg:any) => msg?._id !== clickedMsgId));
    dispatch(setLoading(false));
    setSending(false);
    dispatch(toggleRefresh(!refresh));
    return "msgActionDone";
  } catch (error:any) {
    console.log(error);
    displayError(error, "Couldn't Delete Messages");
    dispatch(setLoading(false));
    setSending(false);
  }
}
// message sure option
  const openDeleteMsgConfirmDialog = () => {
    dispatch(setShowDialogActions(true));
    setDialogBody(<>Are you sure you want to delete this message?</>);
    dispatch(displayDialog({ title: "Delete Message", nolabel: "NO", yeslabel: "YES", loadingYeslabel: "Deleting...", action: deleteMessage}));
  };
// delete message area end ---------------------------------------------------------------------------------------------------------------------------------------------------------




  // Initializing Client Socket
  useEffect(() => {
    console.log(io('http://localhost:5000/', { transports: ["websocket"] }));
    dispatch(
      setClientSocket(io('http://localhost:5000/', { transports: ["websocket"] }))
    );
  }, []);







// socket events start hare >>>>>>>>>------------------------------------------------------------------------------------------------------------------------------------------------

// updated Msg Socket Event Handler
const updatedMsgSocketEventHandler = () => {
  clientSocket
    .off("update modified msg")
    .on("update modified msg", (updatedMsg:any) => {
      if (!updatedMsg) return;
      const { chat } = updatedMsg;
      dispatch(toggleRefresh(!refresh));
      if (selectedChat && chat && selectedChat._id === chat._id) {
        updatedMsg["sent"] = true;
        updatedMsg["chat"] = updatedMsg.chat?._id;
        setTimeout(() => {
          // Only updating msg content using 'document' method
          // as updating 'messages' state will re-render all
          // msgs and scroll to bottom, which may prevent the
          // receiver to edit or view his/her msg, causing bad UX
          if (parseInnerHTML(updatedMsg.content)) {
           let updateContent= document.getElementById(`${updatedMsg._id}---content`) as HTMLInputElement
           updateContent.innerHTML= updatedMsg.content;
          }
          // let updateImage= document.getElementById(`${updatedMsg._id}---image`) as HTMLInputElement
          // updateImage.src= updatedMsg.fileUrl;
        }, 10);
        // Updating 'state' is the only way to update attachment
      }
    });
};

// deleted Msg Socket Event Handler
const deletedMsgSocketEventHandler = () => {
  clientSocket.off("remove deleted msg")
    .on("remove deleted msg", (deletedMsgData:any) => {
      const { deletedMsgId, chat } = deletedMsgData;
      dispatch(toggleRefresh(!refresh));
      if (selectedChat && chat && selectedChat._id === chat._id) {
        setMessages(messages.filter((m:any) => m?._id !== deletedMsgId));
      } else {
        const notifs = loggedinUser.notifications;
        const updatedUser = {
          ...loggedinUser,
          notifications: notifs.filter((n:any) => n._id !== deletedMsgId),
        };
        dispatch(setLoggedInUser(updatedUser))
      }
    });
};




// Listening to all socket events
useEffect(() => {
  if (!clientSocket) return;
  if (!isSocketConnected && clientSocket) {
    clientSocket.emit("init user", loggedinUser?._id);
    clientSocket.on("get-users", (users:any) => {
    
      
      dispatch(setOnlineUsers(users))
    });
    clientSocket.on("user connected", (userInfoNotification:any) => { 
   if(userInfoNotification !== null){
    if(loggedinUser?.notifications.length!==userInfoNotification.length){
      notificationUpdate(userInfoNotification)
    }
   }
    dispatch(setSocketConnected(true));
});
  }
  deletedMsgSocketEventHandler();
  updatedMsgSocketEventHandler()
});


// socket events end hare >>>>>------------------------------------------------------------------------------------------------------------------------------------------------

// cancel edit option
const discardAttachment = () =>  resetMsgInput({ discardAttachmentOnly: true });
const discardMsgDraft = () => {
  discardAttachment()
  setMsgEditMode(false);
  setSending(true);
   // To execute after the entire code is run
  setMessages([]);
  setTimeout(() => {
    setMessages(messages);
    setSending(false);
    // To execute after all the messages have been mapped
    setTimeout(() => {
      document.getElementById(clickedMsgId)?.scrollIntoView();
    }, 10);
  }, 0);
  setMsgFileRemoved(false);
  return "msgActionDone";
}

  // Open discard draft confirm dialog
  const openDiscardDraftConfirmDialog = () => {
    dispatch(setShowDialogActions(true));
    setDialogBody(<>Are you sure you want to discard this draft?</>);
    dispatch(
      displayDialog({
        title: "Discard Draft",
        nolabel: "NO",
        yeslabel: "YES",
        loadingYeslabel: "Discarding...",
        action: discardMsgDraft,
      })
    );
  };



// message click handler start
const msgsClickHandler=(e:any)=>{
  const { dataset } = e.target;
  const parentDataset = e.target.parentNode.dataset;
  const senderData = (dataset.sender || parentDataset.sender)?.split("===");
  const msgId = dataset.msg || parentDataset.msg;
  const updateEditedMsg = dataset.updateMsg || parentDataset.updateMsg;
  const attachMsgFileClicked = dataset.attachMsgFile || parentDataset.attachMsgFile;
  const editMsgFileClicked = dataset.editMsgFile || parentDataset.editMsgFile;
  const discardDraftClicked =  dataset.discardDraft || parentDataset.discardDraft;
  const removeMsgFileClicked = dataset.removeMsgFile || parentDataset.removeMsgFile;

  if(senderData?.length){
    // Open view profile dialog
    const props = {
      memberProfilePic: senderData[0],
      memberName: senderData[1],
      memberEmail: senderData[2],
    };
    openViewProfileDialog(props);
  }else if(msgId && !msgEditMode){
    msgFileAlreadyExists = Boolean(dataset.fileExists || parentDataset.fileExists);
    setClickedMsgId(msgId);
    openMsgOptionsMenu(e);
  }else if(updateEditedMsg){
    const msgDate = dataset.msgCreatedAt || parentDataset.msgCreatedAt;
    updateMessage(editableMsgContent?.current?.innerHTML,msgDate)
  }else if(attachMsgFileClicked || editMsgFileClicked){
    selectAttachment()
  }else if(discardDraftClicked){
    openDiscardDraftConfirmDialog();
  }else if(removeMsgFileClicked){
    setMsgFileRemoved(true);
    discardAttachment()
  }



 }



 useEffect(() => {
  if (!dontScrollToBottom) scrollToBottom();
}, [messages]);


useEffect(()=>{
  if(fetchMsgs){
    fetchMessages()
    if (isSocketConnected) clientSocket?.emit("join chat", selectedChat?._id);
  }
 },[fetchMsgs])


  const customScroll={ 
    overflow:"auto", scrollbarWidth: 'thin',
    // display: fileAttached && !msgEditMode ? 'none':'flex',
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
    '&::-webkit-scrollbar-track': {
      background: theme==='light'?'#f1f1f1':'#424242',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme==='light'?'#88888896':'#7b7b7b',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme==='light'?'#A8a8a8':'#999',
    },
  
  }

// ---------------------------------------------------------- input file  area ---------------------------------------------------------------------

  const setMediaDuration = (mediaUrl:any, msgFile:any) => {
    const media = new Audio(mediaUrl);
    media.onloadedmetadata = () => {
      const { duration }:any = media;
      const minutes = duration / 60
      const seconds = duration % 60;
      setAttachmentData({
        attachment: msgFile,
        attachmentPreviewUrl: mediaUrl,
        mediaDuration: `${minutes}:${
          seconds < 10 ? `0${seconds}` : seconds
        }+++${msgFile.type}`,
      });
      setFileAttached(true);
    };
  };

  const handleMsgFileInputChange=(e:any)=>{
    const msgFile = e.target.files[0];
    if (!msgFile) return;
    if (msgFile.size >= FIVE_MB) {
      msgFileInput.current.value = "";
      return dispatch(
        displayToast({ message: "Please Select a File Smaller than 5 MB", type: "warning", duration: 4000, positionVert: "bottom",positionHor:'center'})
      );
    }

    const fileUrl = URL.createObjectURL(msgFile);
    if (/^(video\/|audio\/)/.test(msgFile.type)) {
      setMediaDuration(fileUrl, msgFile);
    } else {
      setAttachmentData({
        attachment: msgFile,
        attachmentPreviewUrl: fileUrl,
      });
      setFileAttached(true);
    }

  }

    return (
        <div className='messageMainView'>
            {
               selectedChat?(
                     <>
                     <MsgHeader
                       close={close}
                       openViewProfileDialog={openViewProfileDialog}>
                     </MsgHeader>

                      <section className="messageBody-main">
{/* message main Content show */}
                           <Box className="messageListShow"
                            onClick={msgsClickHandler}
                            sx={customScroll}
                           >
                          <div className="msgListBottom" ref={msgListBottom}></div>
                           {loadingMsgs && !sending ? (
                              <LoadingMsgs count={8} />
                             ):(
                              messages.map((m:any, i:any, msgs:any) =>(
                                <Message
                                   key={m._id}
                                   msgSent={m.sent}
                                   currMsg={m}
                                   msgEditMode={msgEditMode}
                                   clickedMsgId={clickedMsgId}
                                   ref={editableMsgContent}
                                   downloadingFileId={downloadingFileId}
                                   loadingMediaId={loadingMediaId}
                                   attachmentData={attachmentData}
                                   msgFileRemoved={msgFileRemoved}
                                   prevMsg={i < msgs.length - 1 ? msgs[i + 1] : null}
                                ></Message>
                              ))
                              )
                              }
                           </Box>

{/* Edit/Delete Message menu */}
                        <MsgOptionsMenu
                         anchor={msgOptionsMenuAnchor}
                         setAnchor={setMsgOptionsMenuAnchor}
                         clickedMsg={clickedMsgId}
                         editMsgHandler={editMsgHandler}
                         openDeleteMsgConfirmDialog={openDeleteMsgConfirmDialog}
                        />


                      <div className='messageInput'>
                         <input type="text"
                   
                         ref={msgContent}
                         placeholder='Aa'
                         style={{backgroundColor:theme==='light'?'#f0f2f5':'#3a3b3c'}}
                          />
                      </div>

                       </section>



                  <input
                  type="file"
                  accept="*"
                  onChange={handleMsgFileInputChange}
                  name="attachment"
                  id="attachMsgFile"
                  ref={msgFileInput}
                  style={{display:'none'}}
                  disabled={loadingMsgs}
                />
                     </>
               ):(
            
                     <h2 style={{margin:'0'}}>
                      welcome to AMAN CHAT
                     </h2>
        
               )
            }
        </div>
    );
};

export default MessagePage;