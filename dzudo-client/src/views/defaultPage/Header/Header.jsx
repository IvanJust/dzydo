
import React from "react";
import "./header-style.css"
import { useState, useEffect } from 'react';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';


import logo from '../../../images/logo-dzudo.png';
import Auth from "../../UIpack/Auth/Auth";
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cyan } from "@mui/material/colors";
// import Socket from "../../../components/Socket";
// import logo from '/logo.svg';

const styleHead = {
    color: cyan[700],
}

function Header() {

    const isAdmin = useSelector((state) => state.user.isAdmin);
    const isLogin = useSelector((state) => state.user.isLogin);
    const event = useSelector((state) => state.user.eventInfo);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const navigate = useNavigate();

    const pages = [
        // {
        //     name: 'Соревнования',
        //     nav: 'games',
        //     isEvent: event.id,
        // }, 
        {
            name: 'Результаты',
            nav: 'writing',
            isEvent: event.id,
        }, 
        {
            name: 'Таблица',
            nav: 'table',
        }
    ];

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    function goTo(nav){
        navigate("/"+nav, {replace: false});
        // console.debug(nav);
    }
    function CompMenu({item}){
        if(item.isEvent != 0){
            return(
                <MenuItem onClick={handleCloseNavMenu}>
                    <Typography 
                        textAlign="center"
                        onClick={()=>goTo(item.nav)}
                    >
                        {item.name}
                    </Typography>
                </MenuItem>
            )
        }else{
            return false;
        }
    }
    function CompButton({item}){
        if(item.isEvent != 0){
            return(
                <Button
                    sx={{ my: 2, color: 'white', display: 'block' }} 
                    onClick={()=>goTo(item.nav)}
                >
                    {item.name}
                </Button>
            )

        }else{
            return false;
        }
    }

  return (
    <AppBar position="sticky" sx={{backgroundColor: styleHead.color}}>
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    {isLogin && <>
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
                        {pages.map((page, index) => (
                            <CompMenu  key={index} item={page} />
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
                    </>}
                    <Box className="header-logo" sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, ml: 1}}>
                        <img onClick={() => goTo('')} title="Дзюдо-Ката" src={logo}/>
                    </Box>
                </Box>
                {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                <Box className="header-logo" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, cursor: 'pointer' }}>
                    <img onClick={() => goTo('')} title="Дзюдо-Ката" src={logo}/>
                </Box>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, cursor: 'pointer' }}>
                    {isLogin && <>
                        {pages.map((page, index) => (
                            <CompButton key={index} item={page} />
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
                    </>}
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