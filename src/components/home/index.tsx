import React from 'react';
import withAuth from '../../hooks/withAuth';
import Header from '../elements/Header';



const ChatHome = () => {
    return (
        <>
            <Header></Header>
        </>
    );
};

export default withAuth(ChatHome);