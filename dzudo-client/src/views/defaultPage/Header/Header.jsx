
import React from "react";
import "./header-style.css"
import { useState, useEffect } from 'react';
import { AppBar, Avatar, Box, Button, Container, Grid, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';


import logo from '../../../images/logo-dzudo.png';
import Auth from "../../UIpack/Auth/Auth";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
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

const pages = ['Соревнования', 'Результаты'];

function Header() {

    const isAdmin = useSelector((state) => state.user.isAdmin);
    console.debug(isAdmin);
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

  return (
    <AppBar position="static">
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
                    <MenuIcon />
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
                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page}</Typography>
                        </MenuItem>
                    ))}
                    {isAdmin && 
                        <MenuItem onClick={handleCloseNavMenu}>
                            <Typography textAlign="center">Административное меню</Typography>
                        </MenuItem>
                    }
                    </Menu>
                </Box>
                {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                <Box item>
                    <div className="header-logo"><img src={logo}/></div>
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    //   onClick={handleOpenNavMenu}
                    color="inherit"
                    >
                    {/* <MenuIcon /> */}
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    //   anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    //   open={Boolean(anchorElNav)}
                    //   onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                    >
                    {pages.map((page) => (
                        <MenuItem key={page}>
                        <Typography textAlign="center">{page}</Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                    <Button
                        key={page}
                        // onClick={handleCloseNavMenu}s
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {page}
                    </Button>
                    ))}
                    {isAdmin && 
                        <Button 
                            variant="contained" 
                            color="warning"
                            sx={{ my: 2, color: 'white', display: 'block' }}>
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