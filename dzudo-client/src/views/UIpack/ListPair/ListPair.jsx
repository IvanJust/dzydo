import { Box, Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../context/SocketProvider";
import { setCurrentPair } from "../../../store/slices/userSlice";

export default function ListPair() {
    const dispatch = useDispatch();
    const currentPair = useSelector(state => state.user.currentPair);

    const { socketAuth } = useContext(SocketContext);

    const [pairs, setPairs] = useState([]);

    const event = useSelector(state => state.user.eventInfo)
    const role_id = useSelector(state => state.user.role.id);

    useEffect(()=>{
        getPairs(event.id, "").then(resp => {
            setPairs(resp.data);
            resp.data.forEach(it => {
                if(it.condition == 1) dispatch(setCurrentPair(it));
            })
        });
    }, [event.id])


    useEffect(() => {
        function onChangeRound(value) {
            console.debug('change pair', value);
            if(value.condition == 1){
                dispatch(setCurrentPair(value));
            }else{
                dispatch(setCurrentPair({}));
            }
            setPairs(pairs.map(it => {
                if (it.id == value.id)
                    return {
                        ...it,
                        condition: value.condition
                    }
                else
                    return it;
    
            }))
        }

        socketAuth.on('change-round', onChangeRound);


        return () => {
            socketAuth.off('change-round', onChangeRound);
        }
    }, [socketAuth, pairs])

    function nextRound(event) {
        socketAuth.emit('next-round');
    }

    function skipRound(event) {
        socketAuth.emit('skip-round');
    }

    return (
        <div>
            {pairs.map(it =>
                <Box marginY={1} key={it.id}>
                    tori - {it.tori.lastname}
                    uke - {it.uke.lastname}
                    condition - {it.condition}
                </Box>
            )}
            {[2, 3].includes(role_id) &&
                <>
                    <Button variant="outlined" onClick={nextRound}>Следующая пара</Button>
                    <Button variant="outlined" onClick={skipRound}>Пропустить пару</Button>
                </>}


        </div>
    )
}