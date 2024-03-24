
import "./header-style.css"
import { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';


import logo from '../../../images/logo-dzudo.png';
import Auth from "../../UIpack/Auth/Auth";
// import Socket from "../../../components/Socket";
// import logo from '/logo.svg';



function Header(){
    const position = 2;
    const [isOpenMenu, setOpenMenu] = useState(false);
    const [itemsMenu, setItemsMenu] = useState([]);


    const toggleMenu = () => {
        setOpenMenu(!isOpenMenu);
    }


    // useEffect(() => {
    //     getMenu(position).then((resp) => {
    //         setItemsMenu(resp.data);
    //     })
    // }, [])

    const header = 'ЧЕМПИОНАТ РОССИИ ПО ДЗЮДО КАТА';
    const header2 = 'KOPER - SLOVENIA 2012';
    // const logo_dzudo = 'https://catherineasquithgallery.com/uploads/posts/2021-03/1614678021_71-p-fon-dzyudo-76.png';
    return(
        <div className="header">
            <Grid container justifyContent="space-around" alignItems="center" p={1} border={1} borderColor='#CFCFCF'>
                <Box item>
                   <div className="header-logo"><img src={logo}/></div>
                 </Box>
                <Box item alignItems='center' justifyContent='center'>
                    <span className="title-h-top">{header}</span>
                    <br />
                    <span className="title-h">{header2}</span>
                    {/* <div>{header}</div> */}
                </Box>
                <Box>
                    <div className="btn-hidden-menu" onClick={toggleMenu}><Auth/></div>
                </Box>
            </Grid>
        </div>
    )

}

export default Header;