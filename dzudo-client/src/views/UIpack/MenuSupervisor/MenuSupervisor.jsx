import React, { useContext, useEffect, useState } from "react";
import ListPair from "../ListPair/ListPair";

import TableAll from "../PanelsMark/TableAll";
import { SocketContext } from "../../../context/SocketProvider";
import { Container, Grid } from "@mui/material";
import { getForSuper, getPairs } from "../../../core/Api/ApiData/methods/pairs";
import { useSelector } from "react-redux";

export default function MenuSupervisor(){
    const { socketAuth, isConnected } = useContext(SocketContext);
    const user = useSelector(state => state.user.userInfo);
    const event = useSelector(state => state.user.eventInfo);
    const [data, setData] = useState([])
    const [pairs, setPairs] = useState([]);

    console.debug("connected status", isConnected);

    useEffect(() => {
        
        if(event.id > 0){
            getForSuper(event.id).then(resp => {
                console.debug(resp.data);
            })
            getPairs(event.id).then(resp => {
                setPairs(resp.data);
            })
        }
        return () => {
            setData([]);
            setPairs([]);
        }
    }, []);

    return (
        <Container>
            <Grid item>
                <ListPair pairs={pairs} setPairs={setPairs} />
            </Grid>
            <Grid item>
                <TableAll data={data} />
            </Grid>
        </Container>
    )
}