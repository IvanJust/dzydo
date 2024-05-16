import { Grid, Typography } from '@mui/material';

import React from "react"

import "./footer-style.css"
import { cyan } from '@mui/material/colors';

const styleFoot = {
    color: cyan[700],
    fontFamily: 'monospace',
    fontSize: 15,
}
function Footer(){
    return (
        <Grid flexDirection={'column'} sx={{backgroundColor: styleFoot.color}}>
            <Grid display={'flex'} sx={{justifyContent: 'space-between', flexDirection: {md: 'row', xs: 'column'}}} alignItems="center" p={1}>
                <Grid>
                    <Typography fontFamily={styleFoot.fontFamily} fontSize={styleFoot.fontSize}>
                        KATA Score Sheets Management
                    </Typography>
                </Grid>
                <Grid>
                    <Typography fontFamily={styleFoot.fontFamily} fontSize={styleFoot.fontSize} sx={{mx:2}}>
                        Сделано в Пензе
                    </Typography>
                    {/* <Button variant="contained" color="primary" onClick={help}>Help</Button> */}
                </Grid>
            </Grid>
            <Grid display={'flex'} justifyContent='center'>
                <Typography fontSize={styleFoot.fontSize}>
                    2009/{(new Date().getFullYear())} © MKO - FFBJ/EJU/IJF
                </Typography>
            </Grid>
        </Grid>
    )
}
export default Footer