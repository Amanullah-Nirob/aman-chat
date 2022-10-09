import { Skeleton } from "@mui/material";
import React from "react";

const LoadingList = ({ listOf, dpRadius, count }:any) => {
  const skeletonStyle = { backgroundColor: "#999" };
  return (
    <>
      {[...Array(count)].map((e, i) => (
        <div key={`loadingListOf${listOf + i}`} className="loadingListItem">
          <Skeleton
            variant="circular"
            className="loadingDp"
            style={{ ...skeletonStyle, width: dpRadius, height: dpRadius }}
          />
          <Skeleton
            variant="rectangular"
            className="loadingTitle"
            style={skeletonStyle}
          />
          <Skeleton
            variant="rectangular"
            className="loadingDesc"
            style={skeletonStyle}
          />
        </div>
      ))}
    </>
  );
};

export default LoadingList;
