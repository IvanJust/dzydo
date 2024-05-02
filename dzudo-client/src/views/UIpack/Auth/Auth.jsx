import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFIO, setEventInfo, setUser, unsetUser } from "../../../store/slices/userSlice";
import { Button, Box, Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardHeader, CardContent, CardActions, Fade, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton, Menu, Typography, ListItemIcon, Divider } from "@mui/material";
import { Form } from "react-router-dom";


import { login } from "../../../core/Api/ApiAuth/methodsAuth";
import "./Auth.css"
import toast from "react-hot-toast";
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { getProfile } from "../../../core/Api/ApiData/methods/portfolio";
import { clearTokens } from "../../../core/Api/functions";
import { getEvent, getEvents } from "../../../core/Api/ApiData/methods/event";

function AuthModal({headerSendForm, handleClose, ...props}) {
    const [events, setEvents] = useState([{id: 1, name: 'Всероссийское соревнование по дзюдо-кате № 10'}]);
    useEffect(() => {
        getEvents().then((resp) => {
            if(resp.data){
                setEvents(resp.data);
            }
        });
    }, []); 
    return (
        <Dialog
          open={props.open}
          keepMounted
          onClose={handleClose}
        //   onChange={props.onChange}
          aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle sx={{borderBottom:'grey solid 1px', display: 'flex', justifyContent:'space-between'}}>
                <Box>Авторизация</Box>
                <CloseIcon onClick={handleClose} fontSize="large" sx={{ cursor:'pointer' }}/>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                        <Form id="authform">
                            <Grid>
                                <Box my={1} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <Box  sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                                        <TextField 
                                            onChange={props.onChange}
                                            id="input-with-sx" 
                                            label="Логин" 
                                            name="login" 
                                            autoFocus 
                                            variant="standard" 
                                            fullWidth
                                            />
                                    </Box>
                                </Box>
                                <Box my={1} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <TextField 
                                        onChange={props.onChange}
                                        id="input-with-sx" 
                                        label="Пароль" 
                                        type="password" 
                                        name="password" 
                                        variant="standard" 
                                        fullWidth
                                        />
                                </Box>
                                <Box mt={1} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="demo-simple-select-label">Мероприятие</InputLabel>
                                        <Select
                                            onChange={props.onChange}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="id_event"
                                            label="Мероприятие"
                                            >
                                                {events.map((event) => (
                                                    <MenuItem value={event.id}>{event.name}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Form>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{justifyContent:'flex-end'}}>
                {/* <Button  variant="outlined">
                    ЗАБЫЛИ ПАРОЛЬ?
                </Button> */}
                <Button  variant="outlined" type="submit" for="authform" onClick={headerSendForm}>
                    ВОЙТИ
                </Button>
            </DialogActions>
        </Dialog>
    )
}
function ButtonAuth(props) {
    return (
        <Button variant="contained" color="primary" disableElevation onClick={props.onClick}>
            {props.children}
        </Button>
    );
}
const settings = ['Профиль', 'Выйти'];
function Auth() {
    const [modalShow, setModalShow] = useState(false);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleOpen = () => setModalShow(true);
    const handleClose = () => setModalShow(false);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
      };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const [dataLogin, setDataLogin] = useState({});
    // console.debug(dataLogin);

    const handleOnChangeLoginForm = (event) => {
        console.debug(event.target.name);
        dataLogin[event.target.name] = event.target.value;
        setDataLogin(dataLogin)
    }

    const dispatch = useDispatch();
    const shortName = useSelector((state) => state.user.userInfo.shortName);
    const roleName = useSelector((state) => state.user.role.name);
    const isLogin = useSelector((state) => state.user.isLogin);

    function sendform() {
        login(dataLogin.login, dataLogin.password, dataLogin.id_event)
            .then((resp) => {
                console.debug('user:', resp);
                if(resp.data_token){
                    // dispatch(setUser(resp.data?.user)); // потом добавить processAccessToken и записать в слайс
                    toast.success("Вы успешно авторизованы!");
                    getProfile(resp.data_token.sub).then((response) =>{
                        // console.debug('user:', response);
                        dispatch(getFIO(response.data[0]));
                        getEvent(dataLogin.id_event).then((resp) => {
                            setEventInfo(resp.data[0]);
                        })
                    });
                    dispatch(setUser(resp.data_token));
                    
                    setModalShow(false);
                }else{
                    toast.error("Неверный логин и/или пароль");
                }
                
            })
            .catch((error) => {
                // Error
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if(error.response.status == 401){
                        toast.error('Пользователь не найден (проверьте правильность логина/пароля/мероприятия)');
                    }else{
                        toast.error(error.response.status + ': ' + error.response.data.Error);
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
                    toast.error(error.message);
                }
            });
    }
    // const openModal = () => {
    //     setModalShow(true);
    // }
    const logoutAcc = () => {
        clearTokens();
        dispatch(unsetUser());
        toast.error('Вы вышли из аккаунта');
        handleCloseUserMenu();
    }
    return (
        <>
            <AuthModal
                headerSendForm={sendform}
                open={modalShow}
                handleClose={handleClose}
                onChange={handleOnChangeLoginForm}
            />

            {/* {isLogin && <Button title='Выйти' onClick={logoutAcc} className="btn-auth">{shortName}</Button>} */}
            {!isLogin &&
                <ButtonAuth onClick={handleOpen}>
                    <div className="btn-auth">
                        <AccountCircle sx={{ mr: 1 }} />
                        <span>Личный кабинет</span>
                    </div>
                </ButtonAuth>
            }
            
            {isLogin && <>
                <Tooltip title={shortName}>
                    <Button variant="outlined" onClick={handleOpenUserMenu}>
                        <IconButton sx={{ p: 0 }}>
                            {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                            <AccountCircle fontSize="large"  color="primary" />
                        </IconButton>
                        <Typography fontSize='small' sx={{ my: 2, color: 'white',  display: { xs: 'none', md: 'flex' }}}>{roleName}</Typography>
                    </Button>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                >
                
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" title="Профиль">{shortName}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logoutAcc}>
                        <ListItemIcon>
                            <Logout fontSize="medium" />
                        </ListItemIcon>
                        <Typography>
                            Выйти
                        </Typography>
                    </MenuItem>
                </Menu>
            </>}
        </>

    )
}

export { ButtonAuth }
export default Auth