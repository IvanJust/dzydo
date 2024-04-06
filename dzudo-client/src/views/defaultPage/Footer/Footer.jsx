import { Box, Button, Grid } from '@mui/material';

import React from "react"

import "./footer-style.css"

function Footer(){
    function help(){
        console.debug('help');
    }
    return (
        <div className='footer'>
            <Grid container justifyContent="end" alignItems="center" p={1}>
                <Box item className="score">
                    KATA Score Sheets Management
                </Box>
                <Box item>
                    <Button variant="contained" color="primary" onClick={help}>Help</Button>
                </Box>
            </Grid>
            <Grid container justifyContent='center'>
                <Box item>
                    <span>2009/{(new Date().getFullYear())} © MKO - FFBJ/EJU/IJF</span>
                </Box>
            </Grid>
        </div>
    )
}
export default Footer