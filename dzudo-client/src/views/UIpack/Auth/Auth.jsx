import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import { setUser } from "../../../store/slices/userSlice";
import { Button, Box, Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardHeader, CardContent, CardActions, Fade } from "@mui/material";
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
          aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>
                Авторизация
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                        <Form id="authform">
                            <Grid>
                                <Box my={1} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                    <TextField 
                                        id="input-with-sx" 
                                        label="Логин" 
                                        name="login" 
                                        autoFocus 
                                        variant="standard" 
                                        />
                                </Box>
                                <Box my={1} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                    <TextField 
                                        id="input-with-sx" 
                                        label="Пароль" 
                                        type="password" 
                                        name="password" 
                                        variant="standard" 
                                        />
                                </Box>
                            </Grid>
                        </Form>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
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
        <div onClick={props.onClick}>
            {props.children}
        </div>
    );
}
function Auth() {
    const [modalShow, setModalShow] = useState(false);
    const handleOpen = () => setModalShow(true);
    const handleClose = () => setModalShow(false);

    const [dataLogin, setDataLogin] = useState({});

    const handleOnChangeLoginForm = (event) => {
        dataLogin[event.target.name] = event.target.value;
        setDataLogin(dataLogin)
    }

    const dispatch = useDispatch();
    const shortName = useSelector((state) => state.user.shortName);
    const isLogin = useSelector((state) => state.user.isLogin);

    function sendform() {
        login(dataLogin.login, dataLogin.password)
            .then((resp) => {
                if(resp.data?.user){
                    dispatch(setUser(resp.data?.user));
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
                    <div className="btn-auth">Личный кабинет</div>
                </ButtonAuth>
            }
        </>

    )
}

export { ButtonAuth }
export default Auth