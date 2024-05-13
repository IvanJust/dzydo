import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import fight from '../../images/main.gif';
import { useSelector } from "react-redux";




export default function Main(){
    const eventInfo = useSelector((state) => state.user.eventInfo);
    return(
        <Grid my={1} flexDirection={'column'}>
            <Grid display={'flex'} justifyContent={'center'}>
                <Typography fontSize={24}>
                    Приветсвуем вас на сайте соревнований Дзюдо Ката
                </Typography>
            </Grid>
            <Grid display={'flex'} justifyContent={'center'}>
                <Typography fontSize={20}>
                    {eventInfo?.name}
                </Typography>
            </Grid>
            <Box>
                <img src={fight}/>
            </Box>
        </Grid>
    )
}