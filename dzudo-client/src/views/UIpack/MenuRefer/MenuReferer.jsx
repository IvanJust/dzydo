import React, { useContext } from "react";
import CustomTabPanel from "../PanelsMark/OnePanel";
import { SocketContext } from "../../../context/SocketProvider";
import ListPair from "../ListPair/ListPair";

export default function MenuReferer(){
    const { socketAuth, isConnected } = useContext(SocketContext);

    console.debug("connected status", isConnected);
    return(
        <>
            <ListPair/>
            <CustomTabPanel value={0} index={0} />
        </>
    )
}