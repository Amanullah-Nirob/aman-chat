// external imports
import React, { useState } from 'react';
// internal imports
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { selectAppState } from '../../app/slices/AppSlice';
import MsgHeader from '../utils/MsgHeader';
import { setSelectedChat } from '../../app/slices/AppSlice';
import { displayDialog, setShowDialogActions } from '../../app/slices/CustomDialogSlice';
import ViewProfileBody from '../dialogs/ViewProfileBody';

const MessagePage = ({setDialogBody}:any) => {
  const dispatch=useAppDispatch()
  const {selectedChat}:any=useAppSelector(selectAppState)
  const [loadingMsgs, setLoadingMsgs] = useState(false);


// Some function
  const close=()=>{
    setLoadingMsgs(false);
    dispatch(setSelectedChat(null));
  }
  const openViewProfileDialog = (props:any) => {
    dispatch(setShowDialogActions(false));
    setDialogBody(props? <ViewProfileBody {...props} />:<ViewProfileBody />);
    dispatch(displayDialog({ title: "View Profile" }));
  };


    return (
        <div className='messageMainView'>
            {
               selectedChat?(
                     <>
                     <MsgHeader
                       close={close}
                       openViewProfileDialog={openViewProfileDialog}>
                     </MsgHeader>


                     </>
               ):(
            
                     'welcome to AMAN CHAT'
        
               )
            }
        </div>
    );
};

export default MessagePage;