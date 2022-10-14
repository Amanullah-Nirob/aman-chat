import Image from 'next/image';
import React from 'react';
import { getFileSizeString, isImageOrGifFile } from './appUtils';
import {Box} from '@mui/material'
const MsgAttachment = ({msgSent,isEditMode,fileEditIcons,downloadingFileId,loadingMediaId,isPreview,fileData,currMsg}:any) => {

    let { fileUrl, file_id, file_name, size } = fileData;

    const IMG_BASE_URL = 'https://cloudinary.com/';
    return (
        <>
           {fileUrl?.startsWith(IMG_BASE_URL) || isImageOrGifFile(file_name) ?
            (
               <span className="msgImageWrapper" style={{position:'relative',width:'260px',height:'200px', display:'inline-block'}}>

                <Image
                 id={`${currMsg?._id}---image`}
                 src={fileUrl}
                 alt={file_name}
                 title={file_name}
                 data-image-id={file_id}
                 layout='fill'
               />
               {isEditMode && (
                 <span className="imageEditIcons">
                   {fileEditIcons}
                 </span>
               )}
             </span>
             ):
               (
               ''
               )
           } 
        </>
    );
};

export default MsgAttachment;