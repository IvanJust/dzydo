import { Box, Button, Grid } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ListPair from "../../ListPair/ListPair";
import SelectEvent from "../../../UIpack v2/SelectEvent/SelectEvent";
import ModalGames from "../../Games/ModalGames";
import { useDispatch } from "react-redux";
import { getPairs } from "../../../../core/Api/ApiData/methods/pairs";
import { setCurrentPair } from "../../../../store/slices/userSlice";
import { SocketContext } from "../../../../context/SocketProvider";


export default function TablePair(){

    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState(0);
    const dispatch = useDispatch();

    const [pairs, setPairs] = useState([]);

    const { socketAuth } = useContext(SocketContext);

    useEffect(()=>{
        if(event != 0){
            getPairs(event).then(resp => {
                setPairs(resp.data);
                resp.data.forEach(it => {
                    if(it.condition == 1) dispatch(setCurrentPair(it));
                })
            });
        }
        return () => {
            setPairs([]);
        }
    }, [event, socketAuth])
    
    const openModal = () => {
        setOpen(true);
    }

    return(
        <Grid item>
            <Box>
                <SelectEvent effect={event} value={event} onChange={(event) => setEvent(event.target.value)} />
            </Box>
            {   event != 0 && 
                <Grid my={1} display='flex' justifyContent='center'>
                    <Button variant="outlined" color="primary" onClick={openModal}>Добавить пару</Button>
                    <ModalGames open={open} setOpen={setOpen} setPairs={setPairs} event_id={event} />
                </Grid>
            }
            <ListPair pairs={pairs} setPairs={setPairs} />
        </Grid>
        
    )
}