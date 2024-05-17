import { Grid, Typography } from '@mui/material';

import React from "react"

import "./footer-style.css"
import { cyan } from '@mui/material/colors';

const styleFoot = {
    color: cyan[300],
    fontFamily: 'monospace',
    fontSize: 15,
}
function Footer(){
    return (
        <Grid flexDirection={'column'} sx={{backgroundColor: styleFoot.color}} p={1}>
            <Grid display={'flex'} sx={{justifyContent: {md: 'flex-end', xs: 'center'}}} alignItems="center">
                {/* <Grid>
                    <Typography fontFamily={styleFoot.fontFamily} fontSize={styleFoot.fontSize}>
                        KATA Score Sheets Management
                    </Typography>
                </Grid> */}
                <Typography fontFamily={styleFoot.fontFamily} fontSize={styleFoot.fontSize} sx={{mx:2}}>
                    Сделано в Пензе
                </Typography>
            </Grid>
            <Grid display={'flex'} justifyContent='center'>
                <Typography fontSize={styleFoot.fontSize}>
                    2024-{(new Date().getFullYear())} {/* © MKO - FFBJ/EJU/IJF */}
                </Typography>
            </Grid>
        </Grid>
    )
}
export default Footer