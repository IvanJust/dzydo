import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import fight from '../../images/main.gif';
import { useSelector } from "react-redux";




export default function Main(){
    const eventInfo = useSelector((state) => state.user.eventInfo);
    return(
        <Grid container my={1} display={'flex'} flexDirection={'column'}>
            <Grid item display={'flex'} justifyContent={'center'} sx={{mx: {xs: 1, md: 0}}}>
                <Typography fontSize={24} textAlign={'center'}>
                    Приветсвуем вас на сайте соревнований Дзюдо Ката
                </Typography>
            </Grid>
            <Grid item display={'flex'} justifyContent={'center'}>
                <Typography fontSize={20}>
                    {eventInfo?.name}
                </Typography>
            </Grid>
            <Grid item display={'flex'} justifyContent={'center'}>
                <img src={fight}/>
            </Grid>
        </Grid>
    )
}