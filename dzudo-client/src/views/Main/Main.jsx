import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import fight from '../../images/main.gif';
import { useSelector } from "react-redux";




export default function Main(){
    const eventInfo = useSelector((state) => state.user.eventInfo);
    return(
        <Grid my={1} justifyContent={'center'} flexDirection={'column'}>
            <Typography fontSize={24}>
                Приветсвуем вас на сайте соревнований Дзюдо Ката
            </Typography>
            <Typography fontSize={20}>
                {eventInfo.name}
            </Typography>
            <Box>
                <img src={fight}/>
            </Box>
        </Grid>
    )
}