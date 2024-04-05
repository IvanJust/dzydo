
import React from "react";
import "./header-style.css"
import { useState, useEffect } from 'react';
import { AppBar, Avatar, Box, Button, Container, Grid, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';


import logo from '../../../images/logo-dzudo.png';
import Auth from "../../UIpack/Auth/Auth";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import Socket from "../../../components/Socket";
// import logo from '/logo.svg';



// function Header2(){


//     const header = 'ЧЕМПИОНАТ РОССИИ ПО ДЗЮДО КАТА';
//     const header2 = 'KOPER - SLOVENIA 2012';
//     // const logo_dzudo = 'https://catherineasquithgallery.com/uploads/posts/2021-03/1614678021_71-p-fon-dzyudo-76.png';
//     return(
//         <div className="header">
//             <Grid container justifyContent="space-around" alignItems="center" p={1} border={1} borderColor='#CFCFCF'>
//                 <Box item>
//                    <div className="header-logo"><img src={logo}/></div>
//                  </Box>
//                 <Box item alignItems='center' justifyContent='center'>
//                     <div><span className="title-h-top">{header}</span></div>
//                     <div><span className="title-h">{header2}</span></div>
//                     {/* <div>{header}</div> */}
//                 </Box>
//                 <Box>
//                     <div className="btn-hidden-menu"><Auth/></div>
//                 </Box>
//             </Grid>
//         </div>
//     )

// }

const pages = [
    {
        name: 'Соревнования',
        nav: 'games',
    }, 
    {
        name: 'Результаты',
        nav: 'writing',
    }
];

function Header() {

    const isAdmin = useSelector((state) => state.user.isAdmin);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    function goTo(nav){
        navigate("/"+nav, {replace: true});
        // console.debug(nav);
    }

  return (
    <AppBar position="static" color="transparent">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon color="primary" />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                    >
                    {pages.map((page) => (
                        <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                            <Typography 
                                textAlign="center"
                                onClick={()=>goTo(page.nav)}
                            >
                                {page.name}
                            </Typography>
                        </MenuItem>
                    ))}
                    {isAdmin && 
                        <MenuItem onClick={handleCloseNavMenu}>
                            <Typography 
                                textAlign="center"
                                onClick={()=>goTo('admin')}
                            >
                                Административное меню
                            </Typography>
                        </MenuItem>
                    }
                    </Menu>
                    <Box item className="header-logo" sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, ml: 1}}>
                        <img onClick={() => goTo('')} title="Дзюдо-Ката" src={logo}/>
                    </Box>
                </Box>
                {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                <Box item className="header-logo" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, cursor: 'pointer' }}>
                    <img onClick={() => goTo('')} title="Дзюдо-Ката" src={logo}/>
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, cursor: 'pointer' }}>
                    {pages.map((page) => (
                    <Button
                        key={page.name}
                        // onClick={handleCloseNavMenu}s
                        sx={{ my: 2, color: 'white', display: 'block' }} 
                        onClick={()=>goTo(page.nav)}
                    >
                        {page.name}
                    </Button>
                    ))}
                    {isAdmin && 
                        <Button 
                            variant="contained" 
                            color="warning"
                            sx={{ my: 2, color: 'white', display: 'block' }}
                            onClick={()=>goTo('admin')}
                        >
                            Административное меню
                        </Button>
                    }
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <Auth/>
                </Box>
            </Toolbar>
        </Container>
    </AppBar>
  );
}
export default Header;