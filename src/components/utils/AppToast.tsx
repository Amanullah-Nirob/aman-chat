import { Alert, AlertTitle,Snackbar} from "@mui/material";
import { hideToast, selectToastState } from "../../app/slices/ToastSlice";
import { useAppSelector,useAppDispatch } from "../../app/hooks";
import React, { useEffect } from "react";


const AppToast = () => {
  const { toastData } = useAppSelector(selectToastState);
  const dispatch = useAppDispatch(); 

  const handleToastClose = (event:React.SyntheticEvent | Event, reason: string) => {
    if (reason === "clickaway") return;
    dispatch(hideToast());
  };


  const { isOpen, title, message, type, duration, positionVert,positionHor } = toastData;

  

  return (
    <Snackbar
      anchorOrigin={{
        vertical: positionVert,
        horizontal:positionHor,
      }}
      style={{ maxWidth: 340, margin: "10px auto" }}
      open={isOpen}
      autoHideDuration={duration}
      onClose={handleToastClose}
    >
      <Alert
        className="text-start"
        variant="filled"
        severity={type}
        onClose={()=>dispatch(hideToast())}
      >
        {title && (
          <AlertTitle
            style={{ fontFamily: "Trebuchet MS", fontSize: 20, marginTop: -8 }}
            className="fw-bold user-select-none"
          >
            {title}
          </AlertTitle>
        )}
        <div style={{ fontSize: 17, marginTop: -4 }}>{message}</div>
      </Alert>
    </Snackbar>
  );
};

export default AppToast;
