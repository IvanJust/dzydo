import React, { useContext, useEffect, useState } from "react";
import ListPair from "../ListPair/ListPair";

import TableAll from "../PanelsMark/TableAll";
import { SocketContext } from "../../../context/SocketProvider";
import { Container, Grid } from "@mui/material";
import { getForSuper, getPairs } from "../../../core/Api/ApiData/methods/pairs";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPair } from "../../../store/slices/userSlice";
import { getRefereeFromEvent } from "../../../core/Api/ApiData/methods/admin";

export default function MenuSupervisor(){
    const dispatch = useDispatch();
    const { socketAuth, isConnected } = useContext(SocketContext);
    const user = useSelector(state => state.user.userInfo);
    const event = useSelector(state => state.user.eventInfo);
    const [data, setData] = useState([])
    const [pairs, setPairs] = useState([]);
    const [refereeList, setRefereeList] = useState([]);
    const [evaluations, setEvaluations] = useState([]);

    console.debug("connected status", isConnected, 'referee ', refereeList);

    useEffect(() => {
        
        if(event.id > 0){
            getRefereeFromEvent(event.id).then(resp => {
                if(resp.data){
                    // console.debug(resp.data);
                    setRefereeList(resp.data);
                }
            });
            getForSuper(event.id).then(response => {
                if(response.data){
                    // console.debug(response.data);
                    setEvaluations(response.data);
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
            setData([]);
            setPairs([]);
            setRefereeList([]);
            setEvaluations([]);
        }
    }, [event]);

    useEffect(() => {
        
        getForSuper(event.id).then(response => {
            if(response.data){
                setEvaluations(response.data);
            }
        })

    }, [refereeList]);

    return (
        <Container>
            <Grid item>
                <ListPair pairs={pairs} setPairs={setPairs} />
            </Grid>
            <Grid item>
                <TableAll data={data} refereeList={refereeList} evaluations={evaluations} />
            </Grid>
        </Container>
    )
}