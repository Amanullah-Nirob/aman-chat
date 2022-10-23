import React from 'react';

const NoConversation = ({loggedinUser}:any) => {
    return (
        <div className='noConversation' style={{padding:'10px'}}>
            <div className="noConInfo">
                <p style={{fontSize:'21px'}}>Hey <span style={{color:'green',fontWeight:'bold'}}>{loggedinUser?.name} </span>
                You may be a new user. If you want to start a conversation with your friend, then you can start a conversation by searching the name or email of your friend in the search option in the header. <br />

                
                </p>
            </div>
        </div>
    );
};

export default NoConversation;