import Image from 'next/image';
import React from 'react';
import welcome from '../../../public/static/images/welcome.png'
import { useAppSelector } from '../../app/hooks';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';
const Welcome = () => {

    const theme=useAppSelector(selectTheme)
    return (
        <div className='welcome'>
            <div className="welcomeContainer">
            <div className="welcomeImage">
                <Image src={welcome} layout='fill'></Image>
            </div>
            <div className='welcomeInfo'>
                <h1>Aman Chat</h1>
            </div>
            </div>
        </div>
    );
};

export default Welcome;