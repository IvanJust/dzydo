import React, { useContext, useEffect, useState } from "react";
import ListPair from "../ListPair/ListPair";

import TableAll from "../PanelsMark/TableAll";
import { SocketContext } from "../../../context/SocketProvider";
import { Container, Grid } from "@mui/material";




export default function MenuSecretar() {
    const { socketAuth, isConnected } = useContext(SocketContext);

    console.debug("connected status", isConnected);

    // useEffect(() => {

    // }, [])

    return (
        <Container justifyContent='space-evenly'>
            <Grid item>
                <ListPair />
            </Grid>
            <Grid item>
                <TableAll secret />
            </Grid>
        </Container>
    )
}