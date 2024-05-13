import React, { useContext, useEffect, useState } from "react";
import ListPair from "../ListPair/ListPair";

import { SocketContext } from "../../../context/SocketProvider";
import { Container, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getRefereeFromEvent } from "../../../core/Api/ApiData/methods/admin";
import { setCurrentPair } from "../../../store/slices/userSlice";
import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
import TableOchki from "../../UIpack v2/TableOchki/TableOchki";




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

    useEffect(() => {
        function saveEvaluationsSuper(value){
            getPairs(event.id).then(resp => {
                setPairs(resp.data);
                resp.data.forEach(it => {
                    if(it.condition == 1) dispatch(setCurrentPair(it));
                })
            });
        }
        socketAuth.on('save-evaluations-supervisor', saveEvaluationsSuper);
        return () => {
            socketAuth.off('save-evaluations-supervisor', saveEvaluationsSuper);
        }
    }, [socketAuth]);


    return (
        <Container>
            <Grid item>
                <ListPair pairs={pairs} setPairs={setPairs} />
            </Grid>
            <Grid item>
                <TableOchki refereeList={refereeList} event_id={event.id} isShowRef pairs={pairs} />
            </Grid>
        </Container>
    )
}