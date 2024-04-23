import { Backdrop, Button, Chip, CircularProgress, Container, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
import { setCurrentPair } from "../../../store/slices/userSlice";
import { useSelector } from "react-redux";
import FaceIcon from '@mui/icons-material/Face';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import SlowMotionVideoTwoToneIcon from '@mui/icons-material/SlowMotionVideoTwoTone';
import ModalGames from "./ModalGames";

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

export default function Games(){
    const { id } = useParams();
    const [pairs, setPairs] = useState([]);
    const [open, setOpen] = useState(false);
    const event = useSelector(state => state.user.eventInfo)
    const isAdmin = useSelector(state => state.user.isAdmin);
    let hidden = false;

    useEffect(()=>{
        getPairs(event.id, "").then(resp => {
            setPairs(resp.data);
            hidden = true;
        });
    }, [event.id])

    useEffect(() => {



    })

    const openModal = () => {
        setOpen(true);
    }

    return(
        <Container>
            <Stack m={2} direction='column'>
                {isAdmin && <Grid display='flex' justifyContent='center'>
                    <Button variant="outlined" color="primary" onClick={openModal}>Добавить пару</Button>
                    <ModalGames open={open} setOpen={setOpen} setPairs={setPairs} />
                </Grid>}
                <Grid justifyContent='center'>
                    <Stack direction="column" spacing={1} my={1}>
                        {pairs.map(it =>
                            <Grid display='flex' alignItems='center' justifyContent='center' key={it.id}>
                                <Chip sx={{display: 'flex', height: 'auto', justifyContent: 'flex-start', mx: 1 }} icon={<SlowMotionVideoTwoToneIcon sx={{px: 1, m: 0}} />} label={<TitleChip title='Раунд' name={it.round} />} />
                                <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start', mx: 1 }} icon={<PlaceTwoToneIcon sx={{px: 1, m: 0}} />} label={<TitleChip title='Регион' name={it.region} />} />
                                <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start', mx: 1 }} icon={<FaceIcon sx={{px: 1, m: 0}} />} label={<TitleChip title='Tori' name={it.tori.lastname} />} />
                                <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start', mx: 1 }} icon={<FaceIcon sx={{px: 1, m: 0}} />} label={<TitleChip title='Uke' name={it.uke.lastname} />} />
                            </Grid>
                        )}
                    </Stack>
                </Grid>
            </Stack>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                hidden={hidden}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    )
}