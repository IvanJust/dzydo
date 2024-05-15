import React, { useContext, useEffect, useState } from "react";
import ListPair from "../ListPair/ListPair";

import { SocketContext } from "../../../context/SocketProvider";
import { Container, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getRefereeFromEvent } from "../../../core/Api/ApiData/methods/admin";
import { setCurrentPair } from "../../../store/slices/userSlice";
import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
import TableOchki from "../../UIpack v2/TableOchki/TableOchki";
import { getTable2 } from "../../../core/Api/ApiData/methods/event";




export default function MenuSecretar() {
    const dispatch = useDispatch();
    const { socketAuth, isConnected } = useContext(SocketContext);
    const event = useSelector(state => state.user.eventInfo);
    const [pairs, setPairs] = useState([]);
    const [refereeList, setRefereeList] = useState([]);
    const [data, setData] = useState([]);

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
            getTable2(event.id).then(resp => {
                if(resp.data){
                    setData(resp.data);
                }
            })
        }
        return () => {
            setRefereeList([]);
            setPairs([]);
            setData([]);
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
        function setDataTable(value){ // TODO: потом проверить по сокету
            if(value){
                setData(data.concat(value.pair));
            }
        }
        socketAuth.on('save-evaluations-supervisor', saveEvaluationsSuper);
        socketAuth.on('save-table-supervisor', setDataTable);
        return () => {
            socketAuth.off('save-evaluations-supervisor', saveEvaluationsSuper);
            socketAuth.off('save-table-supervisor', setDataTable);
        }
    }, [socketAuth, data]);

    

    return (
        <Container>
            <Grid item>
                <ListPair pairs={pairs} setPairs={setPairs} />
            </Grid>
            <Grid item sx={{m: 1}}>
                <TableOchki refereeList={refereeList} isShowRef data={data} />
            </Grid>
        </Container>
    )
}