import { Skeleton } from "@mui/material";

const LoadingMsgs = ({ count }:any) => {
  const skeletonStyle = { backgroundColor: "#777" };
  return (
    <>
      {[...Array(count)].map((e, i) => (
        <div
          key={`loadingMsg${i}`}
          className={`loadingMsg`}
          style={{display:'flex',flexDirection:'column',alignItems: i % 2 ? "start" : "end",margin:'0px 4px 2px 4px',}}
        >
          <Skeleton
            variant="rectangular"
            className={`loadingSender`}
          />
          <Skeleton
            variant="rectangular"
            className={`loadingContent`}
            animation="wave"
          />
        </div>
      ))}
    </>
  );
};

export default LoadingMsgs;
