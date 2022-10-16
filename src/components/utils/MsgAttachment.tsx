import Image from 'next/image';
import React, { useRef } from 'react';
import { getFileSizeString, isImageOrGifFile, truncateString } from './appUtils';
import {Box} from '@mui/material'
import { Audiotrack, Description, Download, Downloading, PictureAsPdf, PlayArrow, PlayCircle,Videocam,} from "@mui/icons-material";
import LottieAnimation from './LottieAnimation';
import animationData from '../../../public/animation/app-loading.json'

const MsgAttachment = ({msgSent,isEditMode,fileEditIcons,downloadingFileId,loadingMediaId,isPreview,fileData,currMsg}:any) => {

    let { fileUrl, file_id, file_name, size } = fileData;
    const fileContents = file_name.split("===") || [];
    file_name = fileContents[0] || file_name;
    const isMediaFile = fileContents[1]?.includes(":");
    const mediaContents = isMediaFile ? fileContents[1].split("+++") : [];
    const mediaFileType = mediaContents[1];
    const mediaFileSize = getFileSizeString(mediaContents[2]);
    const loadingGif = useRef(null);

    let fileSize = mediaContents[0] || parseInt(fileContents[1]) || size || "";

    const IMG_BASE_URL = 'https://cloudinary.com/';

    const isDownloadingFile = downloadingFileId === file_id;
    const fileType =  mediaFileType?.startsWith("video/") || /(\.mp4|\.mov|\.ogv|\.webm)$/.test(file_name)
        ? "Video"
        : mediaFileType?.startsWith("audio/") ||
          /(\.mp3|\.ogg|\.wav)$/.test(file_name)
        ? "Audio"
        : /(\.doc|\.docx)$/.test(file_name)
        ? "Word Doc"
        : /(\.ppt|\.pptx)$/.test(file_name)
        ? "PPT"
        : /(\.xlsx|\.csv|\.xls)$/.test(file_name)
        ? "Spreadsheet"
        : /(\.pdf)$/.test(file_name)
        ? "PDF"
        : file_name.substring(file_name.lastIndexOf(".") + 1)?.toUpperCase();

 
    if (!isMediaFile) {
      fileSize = getFileSizeString(fileSize);
    }

    const attachmentHeader = (
      <>
        {isEditMode ? (
          <span
            className="d-flex justify-content-center w-100 mx-auto"
            style={{ zIndex: 6 }}
          >
            {fileEditIcons}
          </span>
        ) : (
          <span
            data-download={file_id}
            className={`downloadIcon ${isDownloadingFile ? "downloading" : ""} ${
              isPreview || !msgSent ? "d-none" : ""
            }`}
            title={isDownloadingFile ? "Downloading..." : "Download File"}
          >
            {isDownloadingFile ? (
              <Downloading />
            ) : (
              <Download data-download={file_id} />
            )}
          </span>
        )}
      </>
    );

    const fileNameWrapper = (
      <span className={`${isPreview && !isEditMode ? "fs-4" : "fs-6"}`}>
        &nbsp;&nbsp;
        <span title={file_name}>{truncateString(file_name + "", 40, 37)}</span>
      </span>
    );
    const fileInfo = (
      <>
        {fileNameWrapper}
        <div
          className={`${isPreview && !isEditMode ? "fs-5 mt-4" : ""}`}
          style={{ marginBottom: isPreview && !isEditMode ? -10 : 0 }}
        >
          {`${fileType} : ${fileSize}`}
        </div>
      </>
    );

    const hideWhileLoadingMedia =
    loadingMediaId === file_id ? "invisible" : "visible";

    const displayWhileLoadingMedia =
    loadingMediaId === file_id ? "visible" : "invisible";

    const iconStyles = `${isPreview && !isEditMode ? "fs-1" : "fs-2"}`;


   

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
                <div>
              {fileType === "PDF" && !isEditMode ? (
                <div className={`msgFile pdfFile`} style={{  padding: '10px 15px' }}>
                  <div>
                    {!isEditMode && <PictureAsPdf className={iconStyles} />}
                    {attachmentHeader}
                  </div>
                  {fileInfo}
                </div>
                ): fileType === "Spreadsheet" ? (
                  <div className={`msgFile excelFile bg-success`} style={{  padding: '10px 15px' }}>
                    <div>
                      {!isEditMode && <Description className={iconStyles} />}
                      {attachmentHeader}
                    </div>
                    {fileInfo}
                  </div>
                ): fileType === "PPT" ? (
                  <div className={`msgFile pptFile text-light`} style={{  padding: '10px 15px' }}>
                    <div>
                      {!isEditMode && <Description className={iconStyles} />}
                      {attachmentHeader}
                    </div>
                    {fileInfo}
                  </div>
                ): fileType === "Word Doc" ? (
                  <div
                    className={`msgFile wordFile`}

                    style={{ borderRadius: isEditMode ? 10 : 5,padding:'10px 15px',textAlign:'center' }}
                  >
                    <div>
                      {!isEditMode && <Description className={iconStyles} />}
                      {attachmentHeader}
                    </div>
                    {fileInfo}
                  </div>
              ): fileType === "Video" ? (
                  <div className={`msgFile mediaFile`} >
                    <div>
                      {attachmentHeader}
                      {!isEditMode && ` ${mediaFileSize}`}
                    </div>
                    {fileNameWrapper}
                    <div
                      data-video={file_id}
                      data-video-name={file_name}
                      title="Click to Play"
                      className="mediaMsg"
                      style={{height:'180px',margin:'15px'}}
                    >
                      <PlayCircle
                        data-video={file_id}
                        data-video-name={file_name}
                        className={`playMedia`}
                        style={{ fontSize: 40,visibility:loadingMediaId === file_id ? "hidden" : "visible" }}
                      />
                      <LottieAnimation
                        ref={loadingGif}
                        style={{
                          position:'absolute',
                          marginBottom: 0,
                          height: 50,
                          color: "white",
                          visibility:loadingMediaId === file_id ? "visible" : "hidden"
                        }}
                        animationData={animationData}
                      />
                      <span
                        data-video={file_id}
                        data-video-name={file_name}
                        className="mediaDuration videoDuration text-light"
                      >
                        <Videocam data-video={file_id} data-video-name={file_name} />
                        {/* &nbsp;&nbsp;{parseInt(fileSize)} */}
                      </span>
                    </div>
                  </div>
                ): fileType === "Audio" ? (
                  <div
                    className={`msgFile mediaFile`}
                    style={{padding:'10px',backgroundColor:'#222'}}
                  >
                    <div>
                      {attachmentHeader}
                      {!isEditMode && ` ${mediaFileSize}`}
                    </div>
                    {fileNameWrapper}
                    <div
                      data-audio={file_id}
                      data-audio-name={file_name}
                      className="mediaMsg bg-gradient px-4 py-2"
                      title="Click to Play"
                    >
                      <PlayArrow
                        data-audio={file_id}
                        data-audio-name={file_name}
                        className={`playMedia`}
                        style={{visibility:loadingMediaId === file_id ? "hidden" : "visible" }}
                      />
                      <LottieAnimation
                        ref={loadingGif}

                        style={{
                          position:'absolute',
                          marginBottom: 0,
                          height: 30,
                          color: "white",
                          visibility:loadingMediaId === file_id ? "visible" : "hidden"
                        }}
                        animationData={animationData}
                      />
                      <span
                        data-audio={file_id}
                        data-audio-name={file_name}
                        className="mediaDuration audioDuration text-light"
                      >
                        <Audiotrack
                          data-audio={file_id}
                          data-audio-name={file_name}
                          style={{ fontSize: 20 }}
                        />
                        {/* &nbsp;{fileSize} */}
                      </span>
                    </div>
                  </div>
                ): (
                  <div className={` msgFile otherFile`} style={{  padding: '10px 15px' }}>
                    <div>
                      {!isEditMode && <Description className={iconStyles} />}
                      {attachmentHeader}
                    </div>
                    {fileInfo}
                  </div>
                )}

                </div>
               )
           } 
        </>
    );
};

export default MsgAttachment;