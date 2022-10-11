// external imports
import React, { forwardRef, useEffect, useRef } from 'react';
import { AttachFile,Close, Delete,Done,DoneAll,Edit, KeyboardArrowDown} from "@mui/icons-material";
import { CircularProgress,Avatar,IconButton } from '@mui/material';
// internal imports
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectAppState } from '../../app/slices/AppSlice';
import { dateStringOf, msgDateStringOf, msgTimeStringOf, setCaretPosition } from './appUtils';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';


const Message = forwardRef(({msgSent,currMsg,prevMsg,msgEditMode,clickedMsgId}:any,editableMsgRef:any) => {
  const loggedinUser=useAppSelector(selectCurrentUser)
  const theme=useAppSelector(selectTheme)
  const {selectedChat}:any=useAppSelector(selectAppState)
  console.log(currMsg);
  
  const msgContentRef = useRef<any | null>(null);
  const { fileUrl, file_id, file_name } = currMsg;
  const { _id, profilePic, name, email } = currMsg?.sender;
  const isLoggedInUser = _id === loggedinUser._id;
  const senderData = `${profilePic}===${name}===${email}`;
  const isSameSender = _id === prevMsg?.sender._id;
  const currMsgDate = new Date(currMsg.createdAt);
  const prevMsgDate = new Date(prevMsg?.createdAt);
  const isOtherDay = dateStringOf(currMsgDate) !== dateStringOf(prevMsgDate);
  const showCurrSender = !isLoggedInUser && selectedChat?.isGroupChat && (!isSameSender || isOtherDay);
  const currMsgId = isLoggedInUser ? currMsg?._id : null;

  const isClickedMsgCurrMsg=clickedMsgId === currMsgId
  const isEditMode = msgEditMode && isClickedMsgCurrMsg;

  useEffect(() => {
      if (msgContentRef?.current) {
        msgContentRef.current.innerHTML = currMsg?.content;
      }
    }, []);


    useEffect(() => {
      if (isEditMode) {
        setCaretPosition(editableMsgRef?.current);
      }
    }, [msgEditMode]);


  return (
      <>
      <div className='messageContentShowMain' style={{display:'flex',justifyContent:isLoggedInUser ? "end" : "start",marginTop: isSameSender ? 3 : 10}}>
{/* group avatar show    */}
      {showCurrSender ? (
            <Avatar
              src={profilePic}
              alt={name}
              data-sender={senderData}
              className="senderAvatar"
            />
        ) : (
          selectedChat?.isGroupChat && <span style={{ width: 30 }}></span>
        )}
{/* message content main box */}
          <div className="messageBox" style={{backgroundColor:isLoggedInUser?'#0088ff':theme==='light'?'#e4e6eb':'#3b3b3b',color:isLoggedInUser?theme==='light'?'#fff':'#fff':''}}
           data-msg={currMsgId}
           data-file-exists={file_id}
          >
{/* message edit ACTION */}
        {isEditMode ? (
            <div style={{ margin: "-5px 25px 3px 0px",display:'flex',justifyContent:'end' }} >

              {(!currMsg?.fileUrl && (
                  <IconButton data-attach-msg-file={true} sx={{ transform: "rotateZ(45deg)" }}>
                    <AttachFile data-attach-msg-file={true} style={{ fontSize: 20 }} />
                  </IconButton>
              ))}

                <IconButton data-discard-draft={true}>
                  <Close data-discard-draft={true} style={{ fontSize: 20 }} />
                </IconButton>

                <IconButton data-update-msg={true} data-msg-created-at={currMsg?.createdAt}>
                  <Done data-update-msg={true} data-msg-created-at={currMsg?.createdAt} style={{ fontSize: 20 }} />
                </IconButton>
            </div>
          ) : (<></> )
          }
         
{/* group name show */}
          {showCurrSender && (
            <span data-sender={senderData} className="msgSender" style={{color:'blue',fontWeight:'bold'}}>
              {name}
            </span>
          )}  

{/* message options icon */}
          {isLoggedInUser && msgSent && (
            <span
              data-msg={currMsgId}
              data-file-exists={file_id}
              title="Edit/Delete Message"
              style={{position:'absolute',top:'0',right:'0',height:'100%'}}
              className={`msgOptionsIcon`}
            >
              <KeyboardArrowDown
                data-msg={currMsgId}
                data-file-exists={file_id}
                style={{ fontSize: 22 }}
                sx={{position:'absolute',top:'0',right:'0'}}
              />
            </span>
          )}

{/* message main TEXT show area */}
           <div className="messageContentMain">
           <span 
            id={`${currMsg?._id}---content`}
            style={{ outline: "none" }}
            contentEditable={isEditMode}
            data-msg-created-at={currMsg?.createdAt}
            ref={isEditMode ? editableMsgRef : msgContentRef}

           ></span>
              <span className='messageTime'>
              {msgTimeStringOf(currMsgDate)}
              {isLoggedInUser && (
                <>
                  {msgSent ? (
                    <DoneAll
                      data-msg={currMsgId}
                      data-file-exists={file_id}
                      sx={{width:'17px',marginLeft:'5px'}}
                    />
                  ) : (
                    <CircularProgress
                      size={10}
                      className="sendStatusIcon"
                    />
                  )}
                </>
              )}
              </span>
           </div>

          </div>
      </div>
      {isOtherDay && (
        <div className={`msgDate`} style={{color:theme==='light'?'gray':'gray'}}>
         {msgDateStringOf(currMsgDate)}
        </div>
       )}
      </>
  );
})

export default Message;