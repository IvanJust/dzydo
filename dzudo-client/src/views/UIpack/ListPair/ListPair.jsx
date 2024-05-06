import { Button, Chip, Grid, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../../context/SocketProvider";
import { setCurrentPair } from "../../../store/slices/userSlice";
import FaceIcon from '@mui/icons-material/Face';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import fight from '../../../images/fight.gif';
import waiting from '../../../images/1486.gif';
import skipping from '../../../images/skipping.gif';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

function TitleChip({title, name}){
    return(
        <Grid flexDirection='column' justifyContent='flex-start'>
            <Typography fontSize={12} pt={1} fontFamily='cursive' color='GrayText'>
                {title}
            </Typography>
            <Typography fontSize={14} pb={1}>
                {name}
            </Typography>
        </Grid>
    )
}

export default function ListPair() {
    const dispatch = useDispatch();
    const currentPair = useSelector(state => state.user.currentPair);

    const { socketAuth } = useContext(SocketContext);

    const [pairs, setPairs] = useState([]);

    const event = useSelector(state => state.user.eventInfo)
    const role_id = useSelector(state => state.user.role.id);

    useEffect(()=>{
        getPairs(event.id).then(resp => {
            setPairs(resp.data);
            resp.data.forEach(it => {
                if(it.condition == 1) dispatch(setCurrentPair(it));
            })
        });
        return () => {
            setPairs([]);
        }
    }, [event.id, socketAuth])


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
                <Grid>
                        <Stack direction="column" spacing={1} my={1}>
                            {pairs.map((it, index) =>
                                        <Grid display='flex' alignItems='center' justifyContent='center'>
                                            <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start' }} icon={<FaceIcon sx={{px: 1, m: 0}} />} label={<TitleChip title='Tori' name={it.tori.lastname} />} />
                                            {/* <SportsKabaddiIcon fontSize="large" /> */}
                                            {it.condition == 1 && <img style={{width: '50px'}} title="Выступают" src={fight}/>}
                                            {it.condition == 0 && <img style={{width: '50px'}} title="В ожидании выступления" src={waiting}/>}
                                            {it.condition == 3 && <img style={{width: '50px'}} title="Пропущено" src={skipping}/>}
                                            {it.condition == 2 && <img style={{width: '50px'}} title="Выступили" src={SelfImprovementIcon}/>}
                                            <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start' }} icon={<FaceIcon sx={{px: 1, m: 0}} />} label={<TitleChip title='Uke' name={it.uke.lastname} />} />
                                            {/* {it.condition} */}
                                        </Grid>
                            )}
                        </Stack>
                    {[2, 3].includes(role_id) && currentPair.id &&
                        <Grid display='flex' sx={{flexDirection: {xs: 'column', md: 'row'}, justifyContent: {xs: 'center', md: 'space-between'}, spacing: {xs: 1, md: 2}}}>
                            <Button variant="outlined" color="success" onClick={nextRound} disabled={currentPair?.condition === 1}>Следующая пара <ArrowForwardIosIcon fontSize="large"/> </Button>
                            <Button variant="outlined" color="primary" onClick={skipRound}>Пропустить пару <SkipNextIcon fontSize="large"/> </Button>
                        </Grid>}
                </Grid>
        </div>
    )
}