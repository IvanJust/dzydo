import { Backdrop, Button, Chip, CircularProgress, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
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
            {pairs.length > 0 && <Stack direction='column'>
                {isAdmin && <Grid display='flex' justifyContent='center'>
                    <Button variant="outlined" color="primary" onClick={openModal}>Добавить пару</Button>
                    <ModalGames open={open} setOpen={setOpen} setPairs={setPairs} />
                </Grid>}
                <Grid justifyContent='center' sx={{overflow: 'auto', position: 'relative'}}>
                    <Stack direction="column" spacing={1} m={1}>
                        {pairs.map(it =>
                        <div key={it.id}>
                            <Grid display='flex' alignItems='center' sx={{justifyContent: {xs: 'flex-start', md: 'center'}}}>
                                <Chip sx={{display: 'flex', height: 'auto', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1} }} icon={<SlowMotionVideoTwoToneIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Раунд' name={it.round} />} />
                                <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1} }} icon={<PlaceTwoToneIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Регион' name={it.region} />} />
                                <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1} }} icon={<FaceIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Tori' name={it.tori.lastname} />} />
                                <Chip sx={{display: 'flex', height: 'auto', width: '180px', justifyContent: 'flex-start', mx: {xs: 0.2, md: 1} }} icon={<FaceIcon sx={{px: {xs: 0.1, md: 1}, m: 0}} />} label={<TitleChip title='Uke' name={it.uke.lastname} />} />
                            </Grid>
                            <Divider sx={{mt: 1, position: "sticky"}} />
                        </div>
                        )}
                    </Stack>
                </Grid>
            </Stack>}
            {pairs.length == 0 && <Backdrop
                sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                // hidden={hidden}
            >
                <CircularProgress color="inherit" />
            </Backdrop>}
        </Container>
    )
}