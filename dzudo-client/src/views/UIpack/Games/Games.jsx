import { Backdrop, Breadcrumbs, Button, Chip, CircularProgress, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
import { useSelector } from "react-redux";
import FaceIcon from '@mui/icons-material/Face';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import SlowMotionVideoTwoToneIcon from '@mui/icons-material/SlowMotionVideoTwoTone';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ModalGames from "./ModalGames";
import Bread from "../../UIpack v2/Bread/Bread";
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

export default function Games({bread}){
    const [pairs, setPairs] = useState([]);
    const [open, setOpen] = useState(false);
    const event = useSelector(state => state.user.eventInfo)
    const isAdmin = useSelector(state => state.user.isAdmin);
    let hidden = false;

    bread = Bread(bread);

    useEffect(()=>{
        if(event.id){
            getPairs(event.id).then(resp => {
                setPairs(resp.data);
                hidden = true;
            });
        }
        return () => {
            setPairs([]);
        }
    }, [event?.id])

    useEffect(() => {



    })

    const openModal = () => {
        setOpen(true);
    }
    
    // const onDragEnd = (result) => {
    //     // Внедрение логики для обновления порядка пар
    //     const { destination, source, draggableId } = result;

    //     if (!destination) {
    //     return;
    //     }
    //     if (
    //     destination.droppableId === source.droppableId &&
    //     destination.index === source.index
    //     ) {
    //     return;
    //     }
    // const column = pairs[source.droppableId];
    // const newTaskIds = Array.from(column.taskIds);
    // newTaskIds.splice(source.index, 1);
    // newTaskIds.splice(destination.index, 0, draggableId);
    
    // // const newColumn = {
    // // ...column,
    // // taskIds: newTaskIds,
    // // };
    
    // // const newBoardData = {
    // // ...pairs,
    // // // columns: {
    // // // ...boardData.columns,
    // // [newColumn.id]: newColumn,
    // // },
    // // };
    
    // // setPairs(pairs);
    // };

    return(
        <Container>
            {/* <DragDropContext onDragEnd={onDragEnd}> */}
                <Breadcrumbs
                    sx={{my: 1}}
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="Административное меню"
                >
                    {bread}
                </Breadcrumbs>
                {isAdmin && <Grid my={1} display='flex' justifyContent='center'>
                    <Button variant="outlined" color="primary" onClick={openModal}>Добавить пару</Button>
                    <ModalGames open={open} setOpen={setOpen} setPairs={setPairs} />
                </Grid>}
                {pairs.length > 0 && 
                    // <Droppable>
                    // {(provided) => (
                            <Grid justifyContent='center' sx={{overflow: 'auto', position: 'relative'}} /*{...provided.droppableProps}*/>
                                <Stack direction="column" spacing={1} m={1}>
                                    {pairs.map((it, index) =>
                                        // <Draggable key={it.id} {...provided.placeholder} draggableId={it.id} index={index}>
                                        //     {(providedDrag) => (
                                                <div key={index} /*{...providedDrag.draggableProps} {...providedDrag.dragHandleProps}*/>
                                                    <Grid display='flex' alignItems='center' sx={{justifyContent: {xs: 'flex-start', md: 'center'}}}>
                                                        <Chip sx={{display: 'flex', height: 'auto', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1} }} icon={<SlowMotionVideoTwoToneIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Раунд' name={it.round} />} />
                                                        <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1} }} icon={<PlaceTwoToneIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Регион' name={it.region} />} />
                                                        <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1} }} icon={<FaceIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Tori' name={it.tori.lastname} />} />
                                                        <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1} }} icon={<FaceIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Uke' name={it.uke.lastname} />} />
                                                    </Grid>
                                                    <Divider sx={{mt: 1, position: "sticky"}} />
                                                </div>
                                        //     )}
                                        // </Draggable>
                                    )}
                                </Stack>
                            </Grid>
                    // )}
                    // </Droppable>
                }
                <Backdrop
                    open={pairs.length == 0}
                    sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            {/* </DragDropContext> */}
        </Container>
    )
}