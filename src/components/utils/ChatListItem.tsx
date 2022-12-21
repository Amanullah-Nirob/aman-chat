// external imports
import React, { useState } from 'react';
import {Avatar,ListItemButton,Badge} from '@mui/material';
import {AudioFile,Description, DoneAll, GifBox, Image, PictureAsPdf,VideoFile,} from "@mui/icons-material";
// internal imports
import { useAppSelector } from '../../app/hooks';
import { selectAppState } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { dateStringOf, isImageFile, msgDateStringOf, msgTimeStringOf, truncateString } from './appUtils';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import TypingIndicator from './TypingIndicator';

const ChatListItem = ({chat,chatNotifCount,typingChatUser}:any) => {
    const loggedinUser=useAppSelector(selectCurrentUser)
    const theme=useAppSelector(selectTheme)
    const { selectedChat }:any = useAppSelector(selectAppState);
    const [check,setCheck]=useState<Boolean>(false)

    const {  _id,  chatName,receiverEmail, isGroupChat,lastMessage,chatDisplayPic,isOnline} = chat;
    const tooltipTitle = isGroupChat ? `Group: ${chatName}\n(${chat?.users?.length} Members)`: `${chatName}\n${receiverEmail}`;

    let lastMsgContent = lastMessage?.content ?.replaceAll("<br>", "\n")
    .replaceAll("&nbsp;", " ")
    .replaceAll("<div>", "\n")
    .replaceAll("</div>", "\n")
    .replaceAll("<span>", "")
    .replaceAll("</span>", "");

    const lastMsgDate = new Date(lastMessage?.createdAt);
    const lastMsgDateString = msgDateStringOf(lastMsgDate);

    const lastMsgFileUrl = lastMessage?.fileUrl;
    const fileContents = lastMessage?.file_name?.split("===") || [];
    const fileType = fileContents[1]?.split("+++")[1];
    const lastMsgFileName = fileContents[0] || "";
    const lastMsgData = lastMsgContent || lastMsgFileName;

    let lastMsgFileType;
    if (lastMsgFileUrl) {
        lastMsgFileType = isImageFile(lastMsgFileUrl)
          ? "image"
          : /(\.gif)$/.test(lastMsgFileUrl)
          ? "gif"
          : fileType?.startsWith("video/") ||
            /(\.mp4|\.mov|\.ogv|\.webm)$/.test(lastMsgFileUrl)
          ? "video"
          : fileType?.startsWith("audio/") ||
            /(\.mp3|\.ogg|\.wav)$/.test(lastMsgFileUrl)
          ? "audio"
          : /(\.pdf)$/.test(lastMsgFileUrl)
          ? "pdf"
          : "otherFile";
      }

    return (

      <ListItemButton
        data-chat={_id}
        data-has-notifs={chatNotifCount}
        className={`chatListUserInfo`}
        selected={selectedChat?._id === _id}
        >

        {/* user Photo */}
        <div style={{position:'relative'}}>
        <Avatar
            src={chatDisplayPic}
            alt={chatName}
            data-chat={_id}
            data-has-notifs={chatNotifCount}
            sx={{width:'55px',height:'55px'}}
        />
               <span style={{display:isOnline?'block':'none',borderColor:theme==='light'?'#fff':'#000'}} className='activeStatus'></span>
        </div>


     <div
        data-chat={_id}
        className='chatUserContent'
        data-has-notifs={chatNotifCount}>
 
 {/* chat Name And Last Messasge Date */}
      <div className="chatNameAndLastMessasgeDate">
        {/* Chat Name  */}
        <p
         data-chat={_id}
         data-has-notifs={chatNotifCount}
         title={tooltipTitle}
         className="chatListName">
         {truncateString(chatName , 31, 28)}
       </p>

       {/* last message date */}
       {lastMessage && (
          <span
            className="lastMsgDate"
            data-chat={_id}
            data-has-notifs={chatNotifCount}
            style={{ color: chatNotifCount ? "#1770e6" : "gray",fontWeight:chatNotifCount?'400':'',fontSize:'15px' }}
          >
            {lastMsgDateString === "Today" ? msgTimeStringOf(lastMsgDate) : lastMsgDateString !== "Yesterday" ? dateStringOf(lastMsgDate) : "Yesterday"}
          </span>
        )}
      </div>

{/* notification Count And last Message Show */}
      <div className="notificationCountAnd-lastMessageShow">
       {/* notification count show */}
       {lastMessage && chatNotifCount && (
        <Badge sx={{zIndex:'0'}}
          data-chat={_id} 
          data-has-notifs={chatNotifCount} 
          badgeContent={chatNotifCount || ""} 
          color="error" 
          className='chatListNotificationCount'
         ></Badge>
        )}

         {/* Last Message content */}
         {typingChatUser ? (
          <p style={{ color: "red",}} className='chatListLastMessage' data-chat={_id} data-has-notifs={chatNotifCount}>
             <TypingIndicator typingChatUser={typingChatUser} />
          </p>
        ):(
            (lastMessage || lastMessage === null || isGroupChat) && (
             <p data-chat={_id} data-has-notifs={chatNotifCount} className="chatListLastMessage" 
             style={{color:theme==='light'?chatNotifCount ?'#1770e6':'rgb(129 129 129)':chatNotifCount ?'#rgb(62 104 255)':'rgb(167 167 167)',fontWeight:chatNotifCount?'bold':''}}
             > 

              {/* last message check ## you or me */}
              <span data-chat={_id} data-has-notifs={chatNotifCount}>
                <>
                  {lastMessage === null || (isGroupChat && !lastMessage) || (!isGroupChat && lastMessage?.sender?._id !== loggedinUser?._id) ? ("") 
                  :
                    lastMessage?.sender?._id === loggedinUser?._id ? (
                    <>
                      {isGroupChat ? (
                        <>You: </>
                      ) : (
                        <small style={{marginRight:'5px',fontSize:'15px'}}>You: </small>
                      )}
                    </>
                  ) : (
                    truncateString(
                      lastMessage?.sender?.name?.split(" ")[0],
                      12,
                      8
                    ) + ": "
                  )}
                </>
             </span>

             {/* last message file check and last message show */}
             {lastMsgFileUrl? (
                <span data-chat={_id} data-has-notifs={chatNotifCount}>
                {lastMsgFileType === "image" ? (
                    <span
                      data-chat={_id}
                      data-has-notifs={chatNotifCount}
                      title={lastMsgData}
                    >
                      <Image
                        data-chat={_id}
                        data-has-notifs={chatNotifCount}
                        className="fileIcon"
                      />{" "}
                      {truncateString(lastMsgContent, 25, 22) || "Photo"}
                    </span>
                  ):
                  lastMsgFileType === "gif" ? (
                    <span
                      data-chat={_id}
                      data-has-notifs={chatNotifCount}
                      title={lastMsgData}
                    >
                      <GifBox
                        data-chat={_id}
                        data-has-notifs={chatNotifCount}
                        className="fileIcon"
                      />{" "}
                      {truncateString(lastMsgContent, 25, 22) || "Gif"}
                    </span>
                  ):
                  lastMsgFileType === "video" ? (
                    <span
                      data-chat={_id}
                      data-has-notifs={chatNotifCount}
                      title={lastMsgData}
                    >
                      <VideoFile
                        data-chat={_id}
                        data-has-notifs={chatNotifCount}
                        className="fileIcon"
                      />{" "}
                      {truncateString(lastMsgContent, 25, 22) || "Video"}
                    </span>
                  ) :
                  lastMsgFileType === "audio" ? (
                    <span
                      data-chat={_id}
                      data-has-notifs={chatNotifCount}
                      title={lastMsgData}
                    >
                      <AudioFile
                        data-chat={_id}
                        data-has-notifs={chatNotifCount}
                        className="fileIcon"
                      />{" "}
                      {truncateString(lastMsgContent, 25, 22) || "Audio"}
                    </span>
                  )
                  :
                  lastMsgFileType === "pdf" ? (
                    <span
                      data-chat={_id}
                      data-has-notifs={chatNotifCount}
                      title={lastMsgData}
                    >
                      <PictureAsPdf
                        data-chat={_id}
                        data-has-notifs={chatNotifCount}
                        className="fileIcon"
                      />{" "}
                      {truncateString(lastMsgData, 22, 19) || "Pdf"}
                    </span>
                  )
                  :
                  (
                    <span
                      data-chat={_id}
                      data-has-notifs={chatNotifCount}
                      title={lastMsgData}
                    >
                      <Description
                        data-chat={_id}
                        data-has-notifs={chatNotifCount}
                        className="fileIcon"
                      />{" "}
                      {truncateString(lastMsgData, 22, 19) || "File"}
                    </span>
                  )
                }
                </span>
             ):(
                <span
                  data-chat={_id}
                  data-has-notifs={chatNotifCount}
                  title={lastMsgContent}
                >
                  {lastMessage === null
                    ? "Last Message was deleted"
                    : isGroupChat && !lastMessage
                    ? `New Group Created`
                    : truncateString(lastMsgContent, 35, 32)
                  }
                </span>
             )
            }


            </p>
            )
        )
      }
      </div>
      </div>
    </ListItemButton>
    );
};

export default ChatListItem;