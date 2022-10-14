import React from 'react';
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { truncateString } from './appUtils';
import MsgAttachment from './MsgAttachment';
import Image from 'next/image';

const AttachmentPreview = ({isEditMode,attachmentData,fileEditIcons}:any) => {
   const {attachment: { name, type, size }, attachmentPreviewUrl} = attachmentData;
   const PLACEHOLDER_IMG = process.env.DEFAULTImage;
   const previewTitle = type.startsWith("application/") ? "Attached File" : name;


   const editIconsWrapper = (
    <span style={{ zIndex: 6,position:'absolute',top:0,left:0}}>
      {fileEditIcons}
    </span>
  );

    return (
        <div className='preFile'>
        {!isEditMode && (
          <IconButton data-discard-file={true} sx={{ position: "absolute", left: 15, top: 12}}>
            <Close data-discard-file={true} />
          </IconButton>
         )}
    {/* Attached File Name */}
      {!isEditMode && (
          <span style={{ color: "lightblue", fontSize: 25, zIndex: 5 }}>
            {truncateString(previewTitle, 23, 20) || "Attached File"}
          </span>
      )}
        {type?.startsWith("image/") ? (
          <div className='preFalseImage'>
            {editIconsWrapper}
            <Image src={attachmentPreviewUrl || PLACEHOLDER_IMG} alt="msgAttachment" layout='fill' />
          </div>
        ):type?.startsWith("audio/") ? (
            <div style={{ width: "clamp(190px, 48vw, 290px)" }}>
              <span className="m-2" style={{ zIndex: 6 }}>
                {fileEditIcons}
              </span>
              <audio src={attachmentPreviewUrl || ""} controls autoPlay>
                {name}
              </audio>
            </div>
          ) : type?.startsWith("video/") ? (
            <div>
              {editIconsWrapper}
              <video src={attachmentPreviewUrl || ""}  controls  autoPlay>
                {name}
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
                size,
              }}
            />
          )}

        </div>
    );
};

export default AttachmentPreview;