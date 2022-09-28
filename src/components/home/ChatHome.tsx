import { useRouter } from 'next/router';
import React, {  useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../app/slices/auth/authSlice';


const ChatHome = () => {
 const user=useAppSelector(selectCurrentUser)

 const router=useRouter()
 useEffect(() => {
    if(!user.token){
        router.push('/login')
        return
      }
      
  }, [])
 
    return (
        <div>
            bangladesh
        </div>
    );
};

export default ChatHome;