import React from 'react';
import { Close } from "@mui/icons-material";
import { Box } from "@mui/material";
import { IconButton } from "@mui/material";
import { truncateString } from './appUtils';
import MsgAttachment from './MsgAttachment';
import Image from 'next/image';
import { useAppSelector } from '../../app/hooks';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';

const AttachmentPreview = ({isEditMode,attachmentData,fileEditIcons}:any) => {
   const {attachment, attachmentPreviewUrl}:any = attachmentData;
  //  const {type,name,size}:any=attachment
   const PLACEHOLDER_IMG = process.env.DEFAULTImage;
   const previewTitle = attachment?.type.startsWith("application/") ? "Attached File" : attachment?.name;
   const theme=useAppSelector(selectTheme)

   const editIconsWrapper = (
    <span style={{ zIndex: 6,position:'absolute',top:0,left:0}}>
      {fileEditIcons}
    </span>
  );

    return (
      <>
         {
          isEditMode? (
            <div className='preFileIndirect'>
            {attachment?.type?.startsWith("image/") ? (
              <div className='preFalseImage' style={{position:'relative',width:'260px',height:'200px'}}>
                {editIconsWrapper}
                <Image src={attachmentPreviewUrl || PLACEHOLDER_IMG} alt="msgAttachment" layout='fill' />
              </div>
            ):attachment?.type?.startsWith("audio/") ? (
                <div style={{ width: "clamp(100px, 250px, 260px)",position:'relative', }}>
                  <span className="m-2" style={{ zIndex: 6 }}>
                    {fileEditIcons}
                  </span>
                  <audio src={attachmentPreviewUrl || ""} controls autoPlay style={{width:'100%'}}>
                    {attachment?.name}
                  </audio>
                </div>
              ) : attachment?.type?.startsWith("video/") ? (
                <div style={{ width: "clamp(100px, 250px, 260px)",marginTop: '12px',position:'relative', }}>
                  {editIconsWrapper}
                  <video src={attachmentPreviewUrl || ""}  controls  autoPlay style={{ width: '100%'}}>
                    {attachment?.name}
                  </video>
                </div>
              ):(
                <MsgAttachment
                  isEditMode={isEditMode}
                  fileEditIcons={fileEditIcons}
                  isPreview={true}
                  fileData={{
                    fileUrl: attachmentPreviewUrl,
                    file_id: "",
                    file_name: name,
                    size:attachment?.size,
                  }}
                />
              )}
    
            </div>
          ):(
            <Box className='preFileDirect' sx={{backgroundColor:theme==='light'?'#f0f2f5':'#3a3b3c',color:theme==='light'?'#000':'#fff'}}>
            {!isEditMode && (
              <IconButton data-discard-file={true} sx={{ position: "absolute", left: 15, top: 12}}>
                <Close data-discard-file={true} />
              </IconButton>
             )}
{/* Attached File Name */}
            {attachment?.type?.startsWith("image/") ? (
              <div className='preFalseImage' style={{position:'relative',width:'290px',height:'180px'}}>
                {editIconsWrapper}
                <Image src={attachmentPreviewUrl || PLACEHOLDER_IMG} alt="msgAttachment" layout='fill' />
              </div>
            ):attachment?.type?.startsWith("audio/") ? (
                <div style={{ width: "clamp(190px, 48vw, 290px)" }}>
                  <span className="m-2" style={{ zIndex: 6 }}>
                    {fileEditIcons}
                  </span>
                  <audio src={attachmentPreviewUrl || ""} controls autoPlay>
                    {attachment?.name}
                  </audio>
                </div>
              ) : attachment?.type?.startsWith("video/") ? (
                <div style={{ width: "clamp(100px, 250px, 82px)",marginTop: '12px' }}>
                  {editIconsWrapper}
                  <video src={attachmentPreviewUrl || ""}  controls  autoPlay style={{width:'100%'}}>
                    {attachment?.name}
                  </video>
                </div>
              ):(
                <div style={{width:'300px'}}>
                  <MsgAttachment
                  isEditMode={isEditMode}
                  fileEditIcons={fileEditIcons}
                  isPreview={true}
                  fileData={{
                    fileUrl: attachmentPreviewUrl,
                    file_id: "",
                    file_name: attachment?.name,
                    size:attachment?.size,
                  }}
                />
                </div>
                
              )}
    
            </Box>
          )
         }
     
      </>
      
    );
};

export default AttachmentPreview;