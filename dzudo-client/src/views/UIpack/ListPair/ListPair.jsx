import { Alert, Button, Chip, Grid, Stack, Typography } from "@mui/material";
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
import skipping from '../../../images/icons8-skip.gif';
import SelfImprovementTwoToneIcon from '@mui/icons-material/SelfImprovementTwoTone';
import { ShortName } from "../../../features/functions";
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import SlowMotionVideoTwoToneIcon from '@mui/icons-material/SlowMotionVideoTwoTone';
import { green } from "@mui/material/colors";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function TitleChip({title, name}){
    return(
        <Grid flexDirection='column' justifyContent='flex-start'>
            <Grid width={'auto'}>
                <Typography fontSize={12} pt={1} fontFamily='cursive' color='GrayText'>
                    {title}
                </Typography>
            </Grid>
            <Grid width={'auto'}>
                <Typography fontSize={14} pb={1}>
                    {name}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default function ListPair({pairs, setPairs}) {

    const role_id = useSelector(state => state.user.role.id);
    const event = useSelector(state => state.user.eventInfo);
    const dispatch = useDispatch();

    const { socketAuth } = useContext(SocketContext);

    const currentPair = useSelector(state => state.user.currentPair);

    useEffect(() => {
        function onChangeRound(value) {
            if(value.condition == 1){
                dispatch(setCurrentPair(value));
            }else{
                dispatch(setCurrentPair({}));
            }
            getPairs(event.id).then(resp => {
                if(resp.data){
                    setPairs(resp.data)
                }
            })
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

    const colorChip = {
        1: green[200],
    }

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        
        if (!destination) {
        return;
        }
        if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
        ) {
        return;
        }
        
        const pair = pairs[source.droppableId];
        const newRound = pair.round;
        // newTaskIds.splice(source.index, 1);
        // newTaskIds.splice(destination.index, 0, draggableId);
        
        const newPair = {
            ...pair,
            round: newRound,
        };
        
        const newPairs = {
            ...pairs,
            [newPair.id]: newPair,
        };
        
        setPairs(newPairs);
    };

    return (
        <Grid display={'flex'} flexDirection={'column'}>
                {pairs?.length > 0 && <Grid display={'flex'} justifyContent={'center'} sx={{overflow: 'auto', position: 'relative', justifyContent: {md: 'center', xs: 'flex-start'}}}>
                    {/* <DragDropContext onDragEnd={onDragEnd}> */}
                        <Stack direction="column" sx={{display:'inline-block'}} spacing={1} my={1}>
                            {/* <Grid {...provided.droppableProps}> */}
                                {/* <Stack direction="column" spacing={1} m={1}> */}
                                    {pairs?.length>0 && pairs.map((it, index) =>
                                        // <Droppable droppableId={index} key={it.id}>
                                        //     {(providedPable) => (
                                            <Grid
                                                // ref={providedPable.innerRef}
                                                // {...providedPable.droppableProps}
                                            >
                                                {/* <Draggable draggableId={it.id} index={index}>
                                                {(providedGable) => ( */}
                                                    <Grid display='flex' alignItems='center'
                                                        // ref={providedGable.innerRef}
                                                        // {...providedGable.draggableProps}
                                                        // {...providedGable.dragHandleProps}
                                                    >
                                                        <Chip sx={{display: 'flex', height: 'auto', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1}, backgroundColor: colorChip[it.condition] ??  'default'  }} icon={<SlowMotionVideoTwoToneIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Раунд' name={it.round} />} />
                                                        <Chip sx={{display: 'flex', height: 'auto', width: 'auto', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1}, backgroundColor: colorChip[it.condition] ??  'default'  }} icon={<PlaceTwoToneIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Регион' name={it.region} />} />
                                                        <Chip sx={{display: 'flex', height: 'auto', width: 'auto', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1}, backgroundColor: colorChip[it.condition] ??  'default'   }} icon={<FaceIcon sx={{px: 1, m: 0}} />} label={<TitleChip title='Tori' name={ShortName(it.tori)} />} />
                                                        <Chip sx={{display: 'flex', height: 'auto', width: 'auto', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1}, backgroundColor: colorChip[it.condition] ??  'default'   }} icon={<FaceIcon sx={{px: 1, m: 0}} />} label={<TitleChip title='Uke' name={ShortName(it.uke)} />} />
                                                        {it.condition == 1 && <img style={{width: '50px'}} title="Выступают" src={fight}/>}
                                                        {it.condition == 0 && <img style={{width: '50px'}} title="В ожидании выступления" src={waiting}/>}
                                                        {it.condition == 3 && <img style={{width: '50px'}} title="Пропущено" src={skipping}/>}
                                                        {it.condition == 2 && <SelfImprovementTwoToneIcon sx={{width: '50px'}} fontSize={'large'} titleAccess="Выступили" />}
                                                    </Grid>
                                                {/* )}
                                                </Draggable> */}
                                            </Grid>
                                        //     )}
                                        // </Droppable>
                                    )}
                                {/* </Stack> */}
                            {/* </Grid> */}
                        </Stack>
                    {/* </DragDropContext> */}
                </Grid>}
                {pairs?.length == 0 && <Grid mt={1}>
                    <Alert color="info">Список пар пуст</Alert>
                </Grid>}
            {([2, 3].includes(role_id) && pairs?.length>0) &&
                <Grid display='flex' sx={{flexDirection: {xs: 'column', md: 'row'}, justifyContent: {xs: 'center', md: 'space-between'}, spacing: {xs: 1, md: 2}}}>
                    <Button variant="outlined" color="success" onClick={nextRound} disabled={currentPair?.condition === 1}>Следующая пара <ArrowForwardIosIcon fontSize="large"/> </Button>
                    <Button variant="outlined" color="primary" onClick={skipRound}>Пропустить пару <SkipNextIcon fontSize="large"/> </Button>
                </Grid>
            }
        </Grid>
    )
}