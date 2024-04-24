import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL_SOCKET } from "../core/config/config";
import { getCurrentAccessToken } from "../core/Api/functions";

export const SocketContext = createContext()

export default function SocketProvider({ children }) {
    const accessToken = getCurrentAccessToken();
    const [socketAuth, setSocketAuth] = useState(io(BASE_URL_SOCKET));

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInner = io(BASE_URL_SOCKET, {
            auth: {
                token: accessToken
            }
        })
        setSocketAuth(socketInner)

        return ()=>{
            socketInner.disconnect();
        }
    }, [accessToken]);

    useEffect(() => {

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }


        if (socketAuth != null) {
            socketAuth.on('connect', onConnect);
            socketAuth.on('disconnect', onDisconnect);
        }


        return () => {
            if (socketAuth != null) {
                socketAuth.off('connect', onConnect);
                socketAuth.off('disconnect', onDisconnect);
            }
        }
    }, [socketAuth])

    return (
        <SocketContext.Provider value={{ socketAuth, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}