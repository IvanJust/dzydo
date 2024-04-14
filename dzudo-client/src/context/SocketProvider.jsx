import { io } from 'socket.io-client';
import { createContext, useEffect, useState } from "react";
import { BASE_URL_SOCKET } from '../core/config/config';
import { getCurrentAccessToken } from '../core/Api/functions';


export const SocketContext = createContext({});

export default function SocketProvider({ children }) {
    //TODO по идее - неверно. он обновляется только благодаря вложенности в App
    const accessToken = getCurrentAccessToken();

    const [socketAuth, setSocketAuth] = useState(
        io(BASE_URL_SOCKET, {
            auth: {
                token: accessToken
            }
        })
    )

    const [isConnected, setIsConnected] = useState(false);

    useEffect(()=>{

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socketAuth.on('connect', onConnect);
        socketAuth.on('disconnect', onDisconnect);

        return ()=>{
            socketAuth.off('connect', onConnect);
            socketAuth.off('disconnect', onDisconnect);
        };
    })


    return (
        <SocketContext.Provider value={{socketAuth, setSocketAuth, isConnected}}>
            {children}
        </SocketContext.Provider>
    )
}