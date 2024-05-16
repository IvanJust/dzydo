import { Autocomplete, Box, Button, Card, CardActions, CardContent, CardHeader, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getRoles, getUsers, setEventUserRole, unsetEventUserRole } from "../../../../core/Api/ApiData/methods/admin";
import { Form } from "react-router-dom";
import { roleName } from "../../../../core/config/config";
import { ShortName } from "../../../../features/functions";
import toast, { LoaderIcon } from "react-hot-toast";

function RowStaff({ item, event_id, data, setData }){
    const [inputValue, setInputValue] = useState([]);
    const [value, setValue] = useState({});
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if(inputValue.length > 0){
            // getUsers(inputValue).then(resp => {
            // console.debug(inputValue, resp);
            //     setUsers(resp.data.map(item => {return {'label': ShortName(item), 'id': item.id}}));
            // })
        }
        return () => {
            setUsers([]);
        }
    }, [inputValue])

    function getAxiosUsers(text){
        getUsers(text).then(resp => {
            setUsers(resp.data.map(item => {return {'label': ShortName(item), 'id': item.user_id}}));
        })
    }

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
            <Box my={2} key={i} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                <Autocomplete 
                    id={"role"+item.name+item.id+'_'+i}
                    options={users}
                    value={data[item.id+'_'+i]}
                    onChange={(event, newValue) => {data[item.id+'_'+i] = newValue?.id ? {event_id: event_id, user_id: newValue.id, role_id: item.id} : {}; setData(data); setUsers([]); /*console.debug(data, newValue)*/}}
                    inputValue={inputValue[item.id+'_'+i]}
                    onInputChange={(event, newInputValue) => {
                        inputValue[item.id+'_'+i] = newInputValue;
                        setInputValue(inputValue);
                        if(inputValue[item.id+'_'+i].length > 1) getAxiosUsers(inputValue[item.id+'_'+i]);
                    }}
                    sx={{ my: 0.5 }}
                    renderInput={(params) => <TextField variant="filled" {...params} label={count > 1 ? roleName.get(item.id)+' '+i : roleName.get(item.id)} />} 
                    fullWidth
                />
            </Box>)
    }

    return arr;
}

function RegistrationStaff({event, handleClose, ...props}){
    const [roles, setRoles] = useState([]);
    const [data, setData] = useState([]);
    useEffect(() => {
        getRoles().then((resp) => {
            if(resp.data){
                setRoles(resp.data);
            }
        });
        return () => {
            setData([]);
        }
    }, []);

    function SendForm(){
        unsetEventUserRole(event.id).then(response => {
            if(response.data){
                let arrPromise = [];
                for(let item in data){
                    arrPromise.push(setEventUserRole(data[item].event_id, data[item].user_id, data[item].role_id));
                };
                Promise.all(arrPromise).then(resp => {
                    if(resp.length == arrPromise.length){
                        toast.success('Люди успешно назначены на роли.');
                        handleClose();
                    }
                }).catch(resp => {
                    toast.error('Ошибка назначения ролей.')
                })
            }
        })
    }

    return(
        <Grid item>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                {roles.length> 0 && <Card>
                    <CardHeader
                        title={<><Typography fontSize={20}>Назначение ролей по мероприятию</Typography><Typography>{event?.name}</Typography></>}
                    />
                    <CardContent>
                        <Form id="registrationStaff">
                            {roles.map((item, index) => (
                                <RowStaff event_id={event.id} item={item} data={data} setData={setData} key={index} onChange={props.onChange} />
                            ))}
                        </Form>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" sx={{ml: 1, mb: 1}} type="submit" onClick={SendForm}>
                            Назначить
                        </Button>
                    </CardActions>
                </Card>}
                {roles.length == 0 && <LoaderIcon />}
            </Box>
        </Grid>
    )
}

export default RegistrationStaff;