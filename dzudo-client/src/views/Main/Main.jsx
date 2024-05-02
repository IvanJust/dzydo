import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import fight from '../../images/main.gif';




export default function Main(){
    return(
        <Grid my={1} container justifyContent={'center'}>
            <Typography fontSize={24}>
                Приветсвуем вас на сайте соревнований Дзюдо Ката
            </Typography>
            <Box>
                <img src={fight}/>
            </Box>
        </Grid>
    )
}