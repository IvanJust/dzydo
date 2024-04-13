import React, { useEffect, useState } from "react";
import { socket } from "../../../socket/socket";
import ListPair from "../ListPair/ListPair";

import TableAll from "../PanelsMark/TableAll";




export default function MenuSecretar() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }


        socket.on('connect', onConnect);

        socket.on('disconnect', onDisconnect);



        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }
    }, [])

    return (
        <>
            <ListPair/>
            <TableAll/>
        </>
    )
}