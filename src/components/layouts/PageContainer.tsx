import Head from 'next/head';
import React, { ReactNode } from "react";

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
        </Head> 
        {header}
        {children}
        {footer}   
    </>
    );
};

export default PageContainer;