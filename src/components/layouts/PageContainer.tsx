import Head from 'next/head';
import React, { ReactNode } from "react";
import { useAppSelector } from '../../app/hooks';
import { selectTheme } from '../../app/slices/theme/ThemeSlice';

const initHeaders = (
    <>

    </>
);
const initFooters = (
    <>

    </>
);

interface Props {
    children?: ReactNode,
    title?:string,
    header?:ReactNode,
    footer?:ReactNode
}


const PageContainer = ({header = initHeaders,footer = initFooters,children,title}:Props) => {
    const theme=useAppSelector(selectTheme)
    let titleView;
    
    if (title !== '' && title !== undefined) {
        titleView = title + ' | ' + 'AmanChat';
    }else{
        titleView ='AmanChat'; 
    }

    return (
        <>
        <Head>
            <title>{titleView}</title>
            <meta 
                name="theme-color" key="theme-color"
                content={ theme ==='light'?'#fff':'#000'}
                />
        </Head> 
        {header}
        {children}
        {footer}   
    </>
    );
};

export default PageContainer;