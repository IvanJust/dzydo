import React, { useContext, useEffect, useState } from "react";
import ListPair from "../ListPair/ListPair";

import { SocketContext } from "../../../context/SocketProvider";
import { Container, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getRefereeFromEvent, getSupervisorFromEvent } from "../../../core/Api/ApiData/methods/admin";
import { getEvaluationsForSecr } from "../../../core/Api/ApiData/methods/event";
import { setCurrentPair } from "../../../store/slices/userSlice";
import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
import TableSecret from "../PanelsMark/TableSecretar";




export default function MenuSecretar() {
    const dispatch = useDispatch();
    const { socketAuth, isConnected } = useContext(SocketContext);
    const event = useSelector(state => state.user.eventInfo);
    const [pairs, setPairs] = useState([]);
    const [refereeList, setRefereeList] = useState([]);

    console.debug("connected status", isConnected);

    useEffect(() => {
        if(event.id > 0){
            getRefereeFromEvent(event.id).then(resp => {
                if(resp.data){
                    setRefereeList(resp.data);
                }
            });
            getPairs(event.id).then(resp => {
                setPairs(resp.data);
                resp.data.forEach(it => {
                    if(it.condition == 1) dispatch(setCurrentPair(it));
                })
            });
        }
        return () => {
            setRefereeList([]);
            setPairs([]);
        }
    }, [event]);


    return (
        <Container justifyContent='space-evenly'>
            <Grid item>
                <ListPair pairs={pairs} setPairs={setPairs} />
            </Grid>
            <Grid item>
                <TableSecret refereeList={refereeList} />
            </Grid>
        </Container>
    )
}