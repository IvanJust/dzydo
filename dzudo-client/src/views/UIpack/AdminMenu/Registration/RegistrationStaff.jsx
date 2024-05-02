import { Box, Button, Card, CardActions, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { getRoles } from "../../../../core/Api/ApiData/methods/admin";
import { Form } from "react-router-dom";
import { roleName } from "../../../../core/config/config";

function RegistrationStaff({...props}){
    const [roles, setRoles] = useState([]);
    React.useEffect(() => {
        getRoles().then((resp) => {
            if(resp.data){
                setRoles(resp.data);
            }
        });
    }, []);
    return(
        <Grid item>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Card>
                    <CardHeader
                        title='Назначение ролей по мероприятию'
                    />
                    <CardContent>
                        <Form id="registrationUser">
                            {/* <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
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
                            </Box> */}
                            {roles.map((item, index) => (
                                // for(let i = 0; i< item.id == 4 ? 5 : 1; i++){
                                    <Box my={2} key={item.id} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                        <TextField 
                                            onChange={props.onChange}
                                            id="input-with-sx" 
                                            label={roleName.get(item.id)}
                                            type='text'
                                            name={item.name}
                                            variant="filled" 
                                            fullWidth
                                        />
                                    </Box>
                                // }
                            ))}
                        </Form>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" sx={{ml: 1, mb: 1}} type="submit" for="registrationUser" onClick={props.onClick}>
                            Назначить
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}

export default RegistrationStaff;