import React, { useEffect, useRef, useState, DragEvent, useMemo } from 'react'
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';


type Props = {}
export interface ReactFacebookLoginInfo {
    id: string;
    userID: string;
    accessToken: string;
    name?: string | undefined;
    email?: string | undefined;
    picture?:
    | {
        data: {
            height?: number | undefined;
            is_silhouette?: boolean | undefined;
            url?: string | undefined;
            width?: number | undefined;
        };
    }
    | undefined;
}

export default function App({ }: Props) {
    const responseFacebook = (response: ReactFacebookLoginInfo) => {
        console.log(response.accessToken);
    }


    return (
        <>
            <FacebookLogin
                appId="706645737508006"
                autoLoad={true}
                fields="name,email,picture"
                // onClick={componentClicked}
                callback={responseFacebook} 
                cssClass="btn btn-primary p-2"
                />

            <FacebookLogin
                appId="1088597931155576"
                autoLoad
                callback={responseFacebook}
    
            />
        </>
    )
}