import Image from "next/image";

const FILE_STYLES = { width: "100vw", height: "82vh", borderRadius: 10 };
const PLACEHOLDER_IMG = process.env.DEFAULTImage;

const FullSizeImage = ({ event, audioSrc, videoSrc }:any) => {
  return (
    <div>
      {audioSrc ? (
        <audio
          src={audioSrc}
          style={{ width: "clamp(300px, 70%, 600px)" }}
          autoPlay
          controls
        >
          Your browser does not support audio tag.
        </audio>
      ) : videoSrc ? (
        <video src={videoSrc} style={FILE_STYLES} autoPlay controls>
          Your browser does not support video tag.
        </video>
      ) : (
          <div className="fullScreenImage">
              <div className="customizeImage">
              <Image
                src={event.target?.src || PLACEHOLDER_IMG}
                alt={event.target?.alt || "fullSizeImg"}
                layout='fill'
              />
              </div>
          </div>
      )}
    </div>
  );
};

export default FullSizeImage;
