import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAppState } from '../../app/slices/AppSlice';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';
import { selectChildDialogState } from '../../app/slices/ChildDialogSlice';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
import MemberOptionsMenu from '../menus/MemberOptionsMenu';
import { debounce } from '../utils/appUtils';
import ChildDialog from '../utils/ChildDialog';
import GroupMemberItem from '../utils/GroupMemberItem';


let filteredMembersCache:any = [];

const ViewGroupMembers = () => {
    const { groupInfo }:any = useAppSelector(selectAppState);
    const loggedInUser=useAppSelector(selectCurrentUser)
    const theme=useAppSelector(selectTheme)
    const { childDialogMethods } = useAppSelector(selectChildDialogState);
    const [showDialogActions, setShowDialogActions] = useState(true);
    const [showDialogClose, setShowDialogClose] = useState(false);

    const groupMembers = groupInfo?.users;
    const admins = groupInfo?.groupAdmins;
    const [clickedMember, setClickedMember] = useState(null);
    const [memberOptionsMenuAnchor, setMemberOptionsMenuAnchor] = useState(null);



  // LoggedInUser and Group Admins should be at the top
  const sortMembers = () => {
    return [
      loggedInUser,
      ...admins?.filter((admin:any) => admin?._id !== loggedInUser?._id),
      ...groupMembers?.filter((member:any) =>
          member?._id !== loggedInUser?._id && admins?.every((admin:any) => admin?._id !== member?._id)
      ),
    ].map((member) => {
      return {
        ...member,
        isGroupAdmin: admins?.some((admin:any) => member?._id === admin?._id),
      };
    });
  };


  // Update the member list whenever groupInfo is updated
  useEffect(() => {
    if (!groupInfo) return;
    filteredMembersCache = sortMembers();
    setFilteredMembers(filteredMembersCache);
  }, [groupInfo]);

  const [filteredMembers, setFilteredMembers] = useState(filteredMembersCache);


  // Debouncing filterMembers method to limit the no. of fn calls
  const filterMembers = debounce((e:any) => {
    const memberNameInput = e.target?.value?.toLowerCase().trim();
    if (!memberNameInput) {
      return setFilteredMembers(filteredMembersCache);
    }
    setFilteredMembers(
      filteredMembersCache?.filter((user:any) =>
          user?.name?.toLowerCase().includes(memberNameInput) ||
          user?.email?.toLowerCase().includes(memberNameInput)
      )
    );
  }, 600);

  const openMemberOptionsMenu = (e:any) => setMemberOptionsMenuAnchor(e.target);

    return (
     <div
      className="addGroupMembers"
    >
   {/* Member Count */}
    <div style={{ textAlign: "center" }}>
    <span>{`${groupMembers?.length} Member${groupMembers?.length > 1 ? "s" : ""}`}</span>
    </div>  
{/* member search input */}
<div className='memberSearchInput'>
    <input type="text" placeholder='Search Member'
     style={{backgroundColor:theme==='light'?'#f0f2f5':'#303030',color:theme==='light'?'#000':'#fff'}}
     onChange={filterMembers}
    />
</div>
{/* Member list */}
        <div 
        style={{overflow:'auto',position:'relative',margin:'15px 0'}}
          onClick={(e:any)=>{
            const userId =e.target?.dataset.user ||e.target.parentNode.dataset.user || e.target.alt;
            if (userId) {
            // Don't display member options menu for loggedInUser
            if (loggedInUser?._id === userId) return;
            setClickedMember( filteredMembers?.find((m:any) => m?._id === userId));
            openMemberOptionsMenu(e);
            }
          }}
        >
        {filteredMembers?.length > 0 ? (
                <div>
                  {filteredMembers.map((member:any)=>(
                      <GroupMemberItem
                      key={member._id}
                      user={member}
                      truncateValues={[21, 18]}
                    />
                  ))}
                </div>
        ):(
          <span>No Member found</span>
        )
        }
        </div>
       {/* member menu show */}
        <MemberOptionsMenu
        anchor={memberOptionsMenuAnchor}
        setAnchor={setMemberOptionsMenuAnchor}
        clickedMember={clickedMember}
        setShowDialogActions={setShowDialogActions}
        setShowDialogClose={setShowDialogClose}
        childDialogMethods={childDialogMethods}
      />
      {/* Child dialog */}
        <ChildDialog
        showChildDialogActions={showDialogActions}
        showChildDialogClose={showDialogClose}
      />
    </div>
    );
};

export default ViewGroupMembers;