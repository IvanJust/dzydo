import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { Form } from "react-router-dom";
import { setUser } from "../../../../core/Api/ApiData/methods/portfolio";
import toast from "react-hot-toast";

function RegistrationUser(){
    const [dataLoginUser, setDataLoginUser] = useState({});

    const handleOnChangeLoginFormUser = (event) => {
        setDataLoginUser({
            ...dataLoginUser,
            [event.target.name]: event.target.value,
        });
    }

    function registrationUser() {
        setUser(dataLoginUser.login, dataLoginUser.password, dataLoginUser.firstname, dataLoginUser.lastname, dataLoginUser.patronymic)
            .then((resp) => {
                if(resp.data){
                    toast.success("Вы успешно зарегистрировали пользователя!");
                    setDataLoginUser({});
                }else{
                    toast.error("Произошла ошибка регистрации");
                }
                
            });
    }

    return(
        <Grid item>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Card>
                    <CardHeader
                        title='Пожалуйста, заполните все поля'
                    />
                    <CardContent>
                        <Form id="registrationUser" autoComplete="off">
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField
                                    onChange={handleOnChangeLoginFormUser}
                                    id="input-with-sx" 
                                    label="Логин (необязательно)" 
                                    name="login" 
                                    // autoFocus 
                                    autoComplete="off"
                                    value={dataLoginUser['login'] || ''}
                                    // required
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    onChange={handleOnChangeLoginFormUser}
                                    id="input-with-sx" 
                                    label="Пароль (необязательно)" 
                                    type="password" 
                                    name="password" 
                                    value={dataLoginUser['password'] || ''}
                                    autoComplete="off"
                                    // required
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    onChange={handleOnChangeLoginFormUser}
                                    id="input-with-sx" 
                                    label="Фамилия" 
                                    type='text'
                                    name="lastname" 
                                    value={dataLoginUser['lastname'] || ''}
                                    required
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    onChange={handleOnChangeLoginFormUser}
                                    id="input-with-sx" 
                                    label="Имя" 
                                    type="text" 
                                    name="firstname" 
                                    value={dataLoginUser['firstname'] || ''}
                                    required
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                            <Box mt={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    onChange={handleOnChangeLoginFormUser}
                                    id="input-with-sx" 
                                    label="Отчество (необязательно)" 
                                    type='text'
                                    name="patronymic" 
                                    value={dataLoginUser['patronymic'] || ''}
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                            {/* <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Выберете роль пользователя</InputLabel>
                                    <Select
                                        onChange={props.onChange}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="role"
                                        label="Роль"
                                        >
                                            {roles.map((role) => (
                                                <MenuItem value={role.id}>{roleName.get(role.id)}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Box> */}
                        </Form>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" sx={{ml: 1, mb: 1}} type="submit" onClick={registrationUser}>
                            Регистрация
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}

export default RegistrationUser;