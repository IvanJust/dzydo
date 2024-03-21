import React, { useEffect } from "react"
import { socket } from "../socket/socket"

import { useState } from "react";

export default function Socket() {
    console.debug('test2');
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onFooEvent(value) {
            setFooEvents(previous => [...previous, value]);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('foo', onFooEvent);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('foo', onFooEvent);
        };
    }, [])
    return (
        <div>
            <div>
                Connection state: 
                {isConnected && "TRUE"}
                {!isConnected && "FALSE"}
            </div>
            <div>
                events:
            </div>
            <div>
                {fooEvents.map((event, index) => {
                    <li key={ index }>{ event }</li>
                })}
            </div>
        </div>
    )
}