import { Autocomplete, Box, Button, Card, CardActions, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getRoles, getUsers } from "../../../../core/Api/ApiData/methods/admin";
import { Form } from "react-router-dom";
import { roleName } from "../../../../core/config/config";

function RowStaff({item, data, setData, findUser}){
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState({});
    const [users, setUsers] = useState([]);
    console.debug(users)
    useEffect(() => {
        if(inputValue.length > 0){
            getUsers(inputValue).then(resp => {
            console.debug(inputValue, resp);
                setUsers(resp.data.map(item => {return {'label': `${item.lastname} ${item.firstname.substr(0, 1)}. ${item.patronymic.substr(0, 1)}.`, 'id': item.id}}));
            })
        }
        return () => {
            setUsers([]);
        }
    }, [inputValue])

    let arr = [], count;
    switch(item.id){
        case 1:
            count = 0;
            break;
        case 4:
            count = 5;
            break;
        default: 
            count = 1;
            break;
    }

    for(let i = 1; i <= count; i++){
        arr.push(
            <Box my={2} key={item.id} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                <Autocomplete 
                    id={"role"+item.name+item.id+'_'+i}
                    options={users}
                    value={data[count > 1 ? item.id+'_'+i : item.id]}
                    data-name={count > 1 ? item.id+'_'+i : item.id}
                    onChange={(event, newValue) => {data[count > 1 ? item.id+'_'+i : item.id] = newValue.id; setData(data); console.debug(data)}}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        // inputValue[count > 1 ? item.id+'_'+i : item.id] = newInputValue; 
                        setInputValue(newInputValue);
                    }}
                    sx={{ my: 0.5 }}
                    renderInput={(params) => <TextField variant="filled" {...params} label={count > 1 ? roleName.get(item.id)+' '+i : roleName.get(item.id)} />} 
                    fullWidth
                />
            </Box>)
    }

    return arr;
}

function RegistrationStaff({...props}){
    const [roles, setRoles] = useState([]);
    const [data, setData] = useState([]);
    console.debug(data);
    useEffect(() => {
        getRoles().then((resp) => {
            if(resp.data){
                setRoles(resp.data);
                // console.debug(roles);
            }
        });
    }, [data]);
    return(
        <Grid item>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Card>
                    <CardHeader
                        title={props.name ? 'Назначение ролей по мероприятию '+props.name : 'Назначение ролей по мероприятию'}
                    />
                    <CardContent>
                        <Form id="registrationStaff">
                            {roles.map((item, index) => (
                                <RowStaff item={item} data={data} setData={setData} key={index} onChange={props.onChange} />
                            ))}
                        </Form>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" sx={{ml: 1, mb: 1}} type="submit" for="registrationStaff" onClick={props.onClick}>
                            Назначить
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}

export default RegistrationStaff;