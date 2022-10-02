import React from 'react';
import { Close, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight} from "@mui/icons-material";
import { Button, CircularProgress, Dialog, DialogActions,DialogContent, DialogTitle,IconButton} from "@mui/material";
import { useAppDispatch,useAppSelector } from '../../app/hooks';
import { hideDialog } from '../../app/slices/CustomDialogSlice';
import { truncateString } from './appUtils';
import { selectLoadingState } from '../../app/slices/LoadingSlice';




const CustomDialog = ({dialogData,showDialogActions,showDialogClose,closeDialog,children}:any) => {
   const {isFullScreen,isOpen,title,nolabel,yeslabel,loadingYeslabel,action} = dialogData;
   const {loading,disableIfLoading}=useAppSelector(selectLoadingState)
   const dispatch=useAppDispatch()
   

    const handleYes = async () => {
        const result = await action();
        if (result === "profileUpdated" || result === "membersUpdated" || result === "msgActionDone") {
          handleDialogClose();
        } else if (result === "createdGroup") {
          handleDialogClose();
          // Close Parent Dialog as well
          dispatch(hideDialog());
        } else if (result === "pwdUpdated" || result === "loggingOut") {
          handleDialogClose();
        }
      };

     const handleDialogClose = () => {
        if (closeDialog) return closeDialog();
        dispatch(hideDialog());
     };

    return (
        <Dialog
          fullScreen={Boolean(isFullScreen)}
          open={isOpen}
          onClose={handleDialogClose}
          className={disableIfLoading}
        >

        {/* title */}
        <DialogTitle>
        <span title={title} style={{ marginTop: -5, marginRight: 10 }} >
          {truncateString(title, 24, 21)}
        </span>

        {/* dialog close */}
        {showDialogClose && (
          <IconButton onClick={handleDialogClose}  disabled={loading} sx={{ position: "absolute", right: 8, top: 8, color: "#999999"}}>
            <Close />
          </IconButton>
        )}
       </DialogTitle>

       {/* dialog body */}
        <DialogContent>
        {children || <></>}
        </DialogContent>

        {showDialogActions && (
    // action 
        <DialogActions>
            
     {/* no/back button  */}
          <Button  disabled={loading} onClick={handleDialogClose}  >
            {nolabel === "Back" ? (
               <span>
                <KeyboardDoubleArrowLeft
                  className="btnArrowIcons"
                  style={{margin: "0px 5px 2px 0px"}}
                /> Back 
                </span>
            ) : (
              nolabel
            )}
          </Button>

      {/* yes / next button */}
          <Button disabled={loading} onClick={handleYes}>
            {loading && yeslabel !== "Next" ? (
              <>
                <CircularProgress size={17} style={{ marginRight: 12 }} />
                <span style={{ marginRight: 22 }}>{loadingYeslabel}</span>
              </>
            ) : (
              <>
                {yeslabel === "Next" ? (
                  <span>
                    Next
                    <KeyboardDoubleArrowRight
                      className="btnArrowIcons"
                      style={{
                        marginLeft: 4,
                      }}
                    />
                  </span>
                ) : (
                  yeslabel
                )}
              </>
            )}
          </Button>
        </DialogActions>
      )}

        </Dialog>
    );
};

export default CustomDialog;