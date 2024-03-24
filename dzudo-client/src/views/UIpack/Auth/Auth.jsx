import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import { setUser } from "../../../store/slices/userSlice";
import { Button, Box, Grid, TextField, Modal, Card, CardHeader, CardContent, CardActions, Fade } from "@mui/material";
import { Form } from "react-router-dom";

// import axios from "axios";

import { login } from "../../../core/Api/ApiAuth/methodsAuth";
import "./Auth.css"
// import InputWithImage from "../Input/InputWithImage";
import toast from "react-hot-toast";
import { AccountCircle } from "@material-ui/icons";

function AuthModal({headerSendForm, handleClose, ...props}) {
    console.debug('modal');
    return (
        <Modal
            // {...props}
            // size="lg"
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            // centered
        >
        <Fade in={props.open}>
            
            {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                Авторизация на сайте
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography> */}
            <Card>
                <CardHeader closeButton id="modal-modal-title">
                    Авторизация на сайте
                </CardHeader>
                <CardContent id="modal-modal-description">
                    <Form controlId="authform">
                        <Grid>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <TextField 
                                    id="input-with-sx" 
                                    label="Логин" 
                                    name="login" 
                                    autoFocus 
                                    variant="standard" 
                                    />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
                </CardContent>
                <CardActions>
                    <Grid>
                        <Box item>
                            <Button  variant="outlined">
                                ЗАБЫЛИ ПАРОЛЬ?
                            </Button>
                            <Button  variant="outlined" type="submit" for="authform" onClick={headerSendForm}>
                                ВОЙТИ
                            </Button>
                        </Box>
                    </Grid>
                </CardActions>
            </Card>
            {/* <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Авторизация на сайте
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form controlId="authform">
                    <Grid>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField 
                                id="input-with-sx" 
                                label="Логин" 
                                name="login" 
                                autoFocus 
                                variant="standard" 
                                 />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
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
            </Modal.Body>
            <Modal.Footer> */}
                {/* <Button variant="secondary">
                    РЕГИСТРАЦИЯ АБИТУРИЕНТА
                </Button> */}
                {/* <Grid>
                    <Box item>
                        <Button  variant="outlined">
                            ЗАБЫЛИ ПАРОЛЬ?
                        </Button>
                        <Button  variant="outlined" type="submit" for="authform" onClick={headerSendForm}>
                            ВОЙТИ
                        </Button>
                    </Box>
                </Grid>
            </Modal.Footer> */}
        </Fade>
        </Modal>
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
    // axios.post("https://lk.pnzgu.ru/ajax/cloud/auth", {login:'s517670535', password: 'p12rqa20SD'}, {
    //     withCredentials: true,
    //   });

    //   axios.post("https://lk.pnzgu.ru/ajax/api", {login:'s517670535', password: 'p12rqa20SD'}, {
    //     withCredentials: true,
    //   });

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
                handleClose={() => handleClose}
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