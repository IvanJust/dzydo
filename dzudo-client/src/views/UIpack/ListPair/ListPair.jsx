import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { socket } from "../../../socket/socket";

import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
import { useSelector } from "react-redux";

export default function ListPair() {
    const [pairs, setPairs] = useState([]);

    const event = useSelector(state => state.user.eventInfo)

    useEffect(()=>{
        getPairs(event.id, "").then(resp => {
            setPairs(resp.data);
        })

        
        function onNextRound(value) {

        }

        socket.on('next-round', onNextRound);


        return ()=>{
            socket.off('next-round', onNextRound);
        }
    }, [])

    function nextRound(event){
        socket.emit('next-round');
    }

    function skipRound(event){
        socket.emit('skip-round');
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

            <Button variant="outlined" onClick={nextRound}>Следующая пара</Button>
            <Button variant="outlined" onClick={skipRound}>Пропустить пару</Button>
        </div>
    )
}