import { Box, Button, Card, CardActions, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { getRoles } from "../../../../core/Api/ApiData/methods/admin";
import { Form } from "react-router-dom";

function RegistrationUser({...props}){
    const [roles, setRoles] = useState([]);
    React.useEffect(() => {
        getRoles().then((resp) => {
            if(resp.data){
                setRoles(resp.data);
            }
        });
    }, []);
    return(
        <Grid>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Card sx={{minWidth: '30rem'}}>
                    <CardHeader
                        title='Пожалуйста, заполните все поля'
                    />
                    <CardContent>
                        <Form id="registrationUser">
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    label="Логин (необязательно)" 
                                    name="login" 
                                    autoFocus 
                                    // required
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    label="Пароль (необязательно)" 
                                    type="password" 
                                    name="password" 
                                    // required
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    label="Фамилия" 
                                    type='text'
                                    name="lastname" 
                                    required
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    label="Имя" 
                                    type="text" 
                                    name="firstname" 
                                    required
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    label="Отчество (необязательно)" 
                                    type='text'
                                    name="patronymic" 
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
                        <Button variant="outlined" type="submit" for="registrationUser" onClick={props.onClick}>
                            Регистрация
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}

export default RegistrationUser;