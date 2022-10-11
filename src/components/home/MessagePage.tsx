// external imports
import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
// internal imports
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { selectAppState } from '../../app/slices/AppSlice';
import MsgHeader from '../utils/MsgHeader';
import { setSelectedChat } from '../../app/slices/AppSlice';
import { displayDialog, setShowDialogActions } from '../../app/slices/CustomDialogSlice';
import ViewProfileBody from '../dialogs/ViewProfileBody';
import { setFetchMsgs } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import LoadingMsgs from '../utils/LoadingMsgs';
import Message from '../utils/Message';
import MsgOptionsMenu from '../menus/MsgOptionsMenu';
import { displayToast } from '../../app/slices/ToastSlice';
import { getAxiosConfig, isImageOrGifFile, parseInnerHTML } from '../utils/appUtils';
import { setLoading } from '../../app/slices/LoadingSlice';

let msgFileAlreadyExists = false;

const MessagePage = ({setDialogBody}:any) => {
  const dispatch=useAppDispatch()
  const {selectedChat,fetchMsgs}:any=useAppSelector(selectAppState)
  const loggedinUser=useAppSelector(selectCurrentUser)
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [clickedMsgId, setClickedMsgId] = useState("");
  const [msgEditMode, setMsgEditMode] = useState(false);
  const [msgOptionsMenuAnchor, setMsgOptionsMenuAnchor] = useState(null);
  const editableMsgContent = useRef<any | null>(null);
  const [attachmentData, setAttachmentData] = useState({ attachment: null, attachmentPreviewUrl: ""});
  const [msgFileRemoved, setMsgFileRemoved] = useState(false);
  const [dontScrollToBottom, setDontScrollToBottom] = useState(false);
  const msgListBottom = useRef<any>(null);

// Some function
  const close=()=>{
    setLoadingMsgs(false);
    dispatch(setSelectedChat(null));
  }
  const openViewProfileDialog = (props:any) => {
    dispatch(setShowDialogActions(false));
    setDialogBody(props? <ViewProfileBody {...props} />:<ViewProfileBody />);
    dispatch(displayDialog({ title: "View Profile" }));
  };


// fetch Messages start
   const fetchMessages=(options?:any)=>{
    setLoadingMsgs(true);
    fetch(`${process.env.API_URL}/api/message/${selectedChat?._id}`,{
         headers: {'Authorization': `Bearer ${loggedinUser.token}`},
      }).then(res=>res.json())
      .then(data=>{
        
       setMessages(data.map((msg:any) => {msg["sent"] = true; return msg}));

       setLoadingMsgs(false);
       if (fetchMsgs) dispatch(setFetchMsgs(false));
       setSending(false);

      })
   }
   useEffect(()=>{
    if(fetchMsgs){
      fetchMessages()
    }
   },[fetchMsgs])
// fetch Messages end

// srool bottom start
const scrollToBottom = () => {
  msgListBottom.current?.scrollIntoView();
};

useEffect(() => {
  if (!dontScrollToBottom) scrollToBottom();
}, [messages]);

// srool bottom start

// open Msg Options Menu
const openMsgOptionsMenu = (e:any) => {
  if (sending) return;
  setMsgOptionsMenuAnchor(e.target);
};


// reset Msg Input
const resetMsgInput = (options:any) => {
  setAttachmentData({
    attachment: null,
    attachmentPreviewUrl: "",
  });
  if (options?.discardAttachmentOnly) return;
};
// discard Attachment
const discardAttachment = () =>  resetMsgInput({ discardAttachmentOnly: true });




// update message area
const updateMessage = async (updatedMsgContent:any, msgDate:any) => {
  if (!(attachmentData.attachment || (msgFileAlreadyExists && !msgFileRemoved)) && !parseInnerHTML(updatedMsgContent) ) {
    return dispatch(
      displayToast({
        message: "A Message Must Contain Either a File or some Text Content",
        type: "warning",
        duration: 5000,
        position: "top-center",
      })
    );
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
      `${
        msgData?.mediaDuration  ? `===${msgData.mediaDuration}`  : isNonImageFile  ? `===${msgData.attachment?.size || ""}`: ""
       }`,
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


  } catch (error) {
    console.log(error);
    
  }

}




// message click handler start
   const msgsClickHandler=(e:any)=>{
    const { dataset } = e.target;
    const parentDataset = e.target.parentNode.dataset;
    const senderData = (dataset.sender || parentDataset.sender)?.split("===");
    const msgId = dataset.msg || parentDataset.msg;
    const updateEditedMsg = dataset.updateMsg || parentDataset.updateMsg;

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
    }



   }


// edit message area
const editMsgHandler=()=>setMsgEditMode(true)


// delete message area start
const deleteMessage=()=>{
  dispatch(setLoading(true));
  setSending(true);
  
}
  const openDeleteMsgConfirmDialog = () => {
    dispatch(setShowDialogActions(true));
    setDialogBody(<>Are you sure you want to delete this message?</>);
    dispatch(
      displayDialog({
        title: "Delete Message",
        nolabel: "NO",
        yeslabel: "YES",
        loadingYeslabel: "Deleting...",
        action: deleteMessage,
      })
    );
  };
// delete message area end






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
                           <div className="messageListShow"
                            onClick={msgsClickHandler}
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
                                   prevMsg={i < msgs.length - 1 ? msgs[i + 1] : null}
                                ></Message>
                              ))
                              )
                              }
                           </div>

{/* Edit/Delete Message menu */}
                        <MsgOptionsMenu
                         anchor={msgOptionsMenuAnchor}
                         setAnchor={setMsgOptionsMenuAnchor}
                         clickedMsg={clickedMsgId}
                         editMsgHandler={editMsgHandler}
                         openDeleteMsgConfirmDialog={openDeleteMsgConfirmDialog}
                        />

                       </section>
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