import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import { setUser } from "../../../store/slices/userSlice";
import { Button, Box, Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardHeader, CardContent, CardActions, Fade, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Form } from "react-router-dom";

// import axios from "axios";

import { login } from "../../../core/Api/ApiAuth/methodsAuth";
import "./Auth.css"
// import InputWithImage from "../Input/InputWithImage";
import toast from "react-hot-toast";
import AccountCircle from '@mui/icons-material/AccountCircle';

function AuthModal({headerSendForm, handleClose, ...props}) {
    // console.debug(props, headerSendForm, handleClose);
    return (
        <Dialog
          open={props.open}
          keepMounted
          onClose={handleClose}
        //   onChange={props.onChange}
          aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle sx={{borderBottom:'grey solid 1px'}}>
                Авторизация
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                        <Form id="authform">
                            <Grid>
                                <Box my={1} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField 
                                        onChange={props.onChange}
                                        id="input-with-sx" 
                                        label="Логин" 
                                        name="login" 
                                        autoFocus 
                                        variant="standard" 
                                        />
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
                                <Box my={1} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="demo-simple-select-label">Мероприятие</InputLabel>
                                        <Select
                                            onChange={props.onChange}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="id_event"
                                            // value={age}
                                            // onChange={handleChange}
                                            label="Мероприятие"
                                            >
                                            <MenuItem value={1}>Карате</MenuItem>
                                            <MenuItem value={20}>Карате для мальчиков</MenuItem>
                                            <MenuItem value={30}>Туда-сюда</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Form>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{justifyContent:'center'}}>
                <Button  variant="outlined">
                    ЗАБЫЛИ ПАРОЛЬ?
                </Button>
                <Button  variant="outlined" type="submit" for="authform" onClick={headerSendForm}>
                    ВОЙТИ
                </Button>
            </DialogActions>
        </Dialog>
    )
}
function ButtonAuth(props) {
    return (
        <Button variant="outlined" color="primary" disableElevation onClick={props.onClick}>
            {props.children}
        </Button>
    );
}
function Auth() {
    const [modalShow, setModalShow] = useState(false);
    const handleOpen = () => setModalShow(true);
    const handleClose = () => setModalShow(false);

    const [dataLogin, setDataLogin] = useState({});
    // console.debug(dataLogin);

    const handleOnChangeLoginForm = (event) => {
        console.debug(event.target.name);
        dataLogin[event.target.name] = event.target.value;
        setDataLogin(dataLogin)
    }

    const dispatch = useDispatch();
    const shortName = useSelector((state) => state.user.shortName);
    const isLogin = useSelector((state) => state.user.isLogin);

    function sendform() {
        login(dataLogin.login, dataLogin.password, dataLogin.id_event)
            .then((resp) => {
                // console.debug(resp);
                if(resp.data){
                    // dispatch(setUser(resp.data?.user)); // потом добавить processAccessToken и записать в слайс
                    toast.success("Вы успешно авторизованы!");
                }else{
                    toast.error("Неверный логин и/или пароль");
                }
                
            });
    }
    // const openModal = () => {
    //     setModalShow(true);
    // }
    const logoutAcc = () => {
        console.debug('logout');
    }
    //TODO сделать окошко авторизации
    return (
        <>
            <AuthModal
                headerSendForm={sendform}
                open={modalShow}
                handleClose={handleClose}
                onChange={handleOnChangeLoginForm}
            />

            {isLogin && <Button title='Выйти' onClick={logoutAcc} className="btn-auth">{shortName}</Button>}
            {!isLogin &&
                <ButtonAuth onClick={handleOpen}>
                    <div className="btn-auth">
                        <AccountCircle sx={{ mr: 1 }} />
                        <span>Личный кабинет</span>
                    </div>
                </ButtonAuth>
            }
        </>

    )
}

export { ButtonAuth }
export default Auth