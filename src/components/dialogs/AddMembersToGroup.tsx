import { Avatar, Box, Chip, CircularProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAppState, setGroupInfo } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectChildDialogState } from '../../app/slices/ChildDialogSlice';
import UserListItem from '../elements/UserListItem';
import { truncateString } from '../utils/appUtils';
import CloseIcon from '@mui/icons-material/Close';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import { setDialogAction, } from '../../app/slices/CustomDialogSlice';
import { displayToast } from '../../app/slices/ToastSlice';
import ChildDialog from '../utils/ChildDialog';
import NewGroupBody from './NewGroupBody';


function useDebounce(value:string, delay:number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
          setDebouncedValue(value);
      }, delay);
      return () => {
          clearTimeout(handler);
      };
  }, [value, delay]);
  return debouncedValue;
}


const AddMembersToGroup = ({ getAddedMembers, forCreateGroup }:any) => {
    const { groupInfo }:any = useAppSelector(selectAppState);
    const theme = useAppSelector(selectTheme)
    const loggedInUser = useAppSelector(selectCurrentUser);
    const { childDialogMethods } = useAppSelector(selectChildDialogState);
    const { setChildDialogBody, displayChildDialog, closeChildDialog } =  childDialogMethods;
    const dispatch = useAppDispatch();

    const [groupData, setGroupData] = useState(groupInfo);
    const groupMembers = groupData?.users;
    const [addedMembers, setAddedMembers] = useState<any | []>([]);
    const [isMemberSelected, setIsMemberSelected] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const debouncedSearchTerm = useDebounce(keyword, 300);
    const [isSearch, setIsSearch] = useState(false);
    const [searchResult, setSearchResult] = useState<any | null>(null);
    const inputEl = useRef(null);
    const [showDialogClose, setShowDialogClose] = useState(false);
    const [showDialogActions, setShowDialogActions] = useState(true);
      // For 'create group chat'
  const openNewGroupDialog = () => {
    if (addedMembers?.length < 2) {
      return dispatch(
        displayToast({  message: "Please Add Atleast 2 Members", type: "warning", duration: 3000,positionVert: "top",positionHor:'center',
        })
      );
    }
    setShowDialogActions(false);
    setShowDialogClose(false);
    dispatch(setGroupInfo(groupData));
    setChildDialogBody(<NewGroupBody closeChildDialog={closeChildDialog} />);
    displayChildDialog({
      title: "Create New Group",
    });
  };


    useEffect(() => {
      // For create group: [Next >>] button
      if (forCreateGroup) dispatch(setDialogAction(openNewGroupDialog));
    }, [groupData]);

    useEffect(() => {
      setGroupData(groupInfo);
    }, [groupInfo]); 

    useEffect(() => {
      setSearchResult([]);
      setKeyword("");
    }, []);


     const unselectUser = (user:any) => {
      if (!user) return;
      setGroupData({
        ...groupData,
        users: groupMembers.filter((u:any) => u._id !== user._id),
      });
      // Remove user from added member list
      setAddedMembers(addedMembers.filter((u:any) => u._id !== user._id));
      // Add removed user to search result list
      setSearchResult([user, ...searchResult]);
    };


// search area >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 useEffect(() => {
  if (debouncedSearchTerm) {
      setLoading(true);
      if (isMemberSelected) setIsMemberSelected(false);

      if (keyword) {
          fetch(`${process.env.API_URL}/api/user?search=${keyword}`,{
              headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${loggedInUser.token}` },
          }).then(res=>res.json())
          .then(data=>{
              if(data){
                // Remove all the already added members from search results
                  let membersNotAdded = [...data];
                  groupMembers.forEach((addedMember:any) => {
                    membersNotAdded = membersNotAdded.filter((m) => m._id !== addedMember._id
                    );
                  });
                  
                  setLoading(false);
                  setSearchResult(membersNotAdded);
                  setIsSearch(true);
              }
          })   
      } else {
          setIsSearch(false);
          setKeyword('');
      }
      if (loading) {
          setIsSearch(false);
      }
  } else {
      setLoading(false);
      setIsSearch(false);
  }
}, [debouncedSearchTerm]);

 function handleClearKeyword() {
  setKeyword('');
  setIsSearch(false);
  setLoading(false);
 }




  // Views
  let productItemsView,
  clearTextView,
  loadingView
  if (!loading) {
    if (searchResult && searchResult.length > 0) {
        productItemsView = searchResult.map((user:any) => (
            <UserListItem 
             user={user} truncateValues={[27, 24]} 
             key={user._id} />
        ));
    } else {
        productItemsView =keyword && !loading && (
          <p>
            {isMemberSelected ? "No Other Users " : "No Results "}
            Found for {" "}
            <span style={{color:'gold'}}>
              {truncateString(keyword, 25, 22)}
            </span>

          </p>
        )
    }
    if (keyword !== '') {
        clearTextView = (
            <span className="form-action" onClick={handleClearKeyword}>
             <CloseIcon sx={{color:theme==='light'?'#222':'#eee'}} />
            </span>
        );
    }
} else {
  loadingView = (
      <span className="form-action spin">
         <CircularProgress size="18px" />
      </span>
  );
}




    return (
        <div className='addGroupMembers'>
        <section
        className=""
        style={{
          display:'flex',
          flex: "0.33",
          borderRadius: "15px",
          backgroundColor: theme==='light'?'#f0f2f5':"#303030",
          marginBottom: '15px',
          padding: '10px',
          flexWrap:'wrap',
          overflowY:'auto',
          overflowX:'auto'
        }}
      >
        {addedMembers?.map((user:any) => (
          <Chip
            key={user?._id}
            className="userChip text-light bg-success rounded-pill fs-6"
            avatar={
              <Avatar
                className="userChipAvatar"
                alt={user?.name}
                src={user?.profilePic}
              />
            }
            label={truncateString(user?.name?.split(" ")[0], 12, 8)}
            onDelete={() => unselectUser(user)}
          />
        ))}
      </section>
       <div className="search-area-group">
       <form className="search-area-main">
            <div className="search-input">
                 <input
                    ref={inputEl}
                    type="text"
                    value={keyword}
                    placeholder='Search' style={{backgroundColor:theme==='light'?'#f0f2f5':'#303030',color:theme==='light'?'#000':'#fff'}}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {clearTextView}
                {loadingView}
            </div>

            <Box className={`search-result${ isSearch ? ' active ' : ''}`}>
                <div className="userListMain"
                   onClick={(e:any)=>{
                    const userId = e.target.dataset.user || e.target.alt;
                    if (!userId) return;
                    if (!isMemberSelected) setIsMemberSelected(true);
                    const selectedUser = searchResult.find((u:any) => u._id === userId);
                    setGroupData({
                      ...groupData,
                      users: [...groupMembers, selectedUser],
                    });
                  // Add selected user to added member list
                  setAddedMembers([...addedMembers, selectedUser]);
                // Remove selected user from search result list
                setSearchResult(searchResult.filter((u:any) => u._id !== userId));
                }}>
                  {productItemsView}
                </div>

            </Box>
        </form>
       </div>
      {/* Child dialog */}
      <ChildDialog
        showChildDialogActions={showDialogActions}
        showChildDialogClose={showDialogClose}
      />
        </div>
    );
};

export default AddMembersToGroup;