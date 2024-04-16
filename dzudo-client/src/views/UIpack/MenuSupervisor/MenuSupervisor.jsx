import React, { useContext, useEffect, useState } from "react";
import ListPair from "../ListPair/ListPair";

import TableAll from "../PanelsMark/TableAll";
import { SocketContext } from "../../../context/SocketProvider";
import { Grid } from "@mui/material";

export default function MenuSupervisor(){
    const { socketAuth, isConnected } = useContext(SocketContext);

    console.debug("connected status", isConnected);

    // useEffect(() => {

    // }, [])

    return (
        <Grid flexDirection='column'>
            <Grid container justifyContent='center' display='flex'>
                <Grid item>
                    <ListPair />
                </Grid>
                <Grid item>
                    <TableAll />
                </Grid>
            </Grid>
        </Grid>
    )
}