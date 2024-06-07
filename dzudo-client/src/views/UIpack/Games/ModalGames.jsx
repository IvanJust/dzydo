import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPairs, setPair } from "../../../core/Api/ApiData/methods/pairs";
import { getUsers } from "../../../core/Api/ApiData/methods/admin";
import toast from "react-hot-toast";
import { ShortName } from "../../../features/functions";
import StandartAutocomplete from "../../UIpack v2/StandartAutocomlete/StandartAutocomplete";


export default function ModalGames({open, setOpen, setPairs, event_id}){
    const [users, setUsers] = useState([]);
    const [users2, setUsers2] = useState([]);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [data, setData] = useState({event_id});

    const handleClose = () => {
        setOpen(false);
    }
    useEffect(() => {
        console.debug(users);
    }, [users]);

    useEffect(() => {
        return () => {
            setUsers([]);
            setInputValue1('');
            setInputValue2('');
            setData({});
        }
    }, [event_id]);

    function getTori(input){
        console.debug(input);
        if(input.length > 0){
            getUsers(input).then((resp) => {
                setUsers(resp.data.map(item => {return {'label': ShortName(item), 'id': item.user_id}}));
            });
            return true;
        }else{
            setUsers([]);
            return false;
        }
    }
    
    function getUke(input){
        if(input.length > 0){
            getUsers(input).then((resp) => {
                setUsers2(resp.data.map(item => {return {'label': ShortName(item), 'id': item.user_id}}));
            });
            
            return true;
        }else{
            setUsers2([]);
            return false;
        }
    }

    const handleChange = (event) => {
        setData({...data, [event.target.name]: event.target.value});
    }

    const handleChangeToriUke = (ToriUke, newValue) => {
        setData({...data, [ToriUke]: newValue?.id ? newValue.id : 0});
        if(ToriUke == 'tori'){
            setUsers([]);
        }else{
            setUsers2([]);
        } 
    }

    const submitPair = () => {
        setPair(data.event_id, data.tori, data.uke, data.region, data.round).then(resp => {
            if(resp){
                toast.success('Пара создана');
                setData({event_id: event_id})
                getPairs(data.event_id).then(re => {
                    setPairs(re.data);
                    handleClose();
                })
            }
        }).catch(err => {
            if(err){
                toast.error('Ошибка создания пары');
            }
        })
    }

    return(
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
            component: 'form',
            }}
        >
            <DialogTitle>Окно для организации пары выступления</DialogTitle>
            <DialogContent>
                <Grid container py={1} flexDirection='column' display='flex' justifyContent='center'>
                    <StandartAutocomplete 
                        label={"Tori"}
                        id="tori"
                        options={users}
                        getOptionLabel={option => option.label}
                        value={data['tori']}
                        sx={{ my: 1 }}
                        noOptionsText='Пусто'
                        inputValue={inputValue1 || ''}
                        onInputChange={(event, newInputValue) => {
                            console.debug(newInputValue);
                            setInputValue1(newInputValue);
                            if(newInputValue.length>1){ 
                                getTori(inputValue1);
                            }
                        }}
                        onChange={(event, newValue) => {
                            // if (event?.type === "change") {
                            //     setInputValue1(newValue.label);
                            // }
                            handleChangeToriUke('tori', newValue)}}
                        fullWidth
                    />
                    {/* <StandartAutocomplete 
                        label={"Uke"}
                        id="uke"
                        options={users2}
                        getOptionLabel={option => option.title}
                        value={data['uke'] || 0}
                        sx={{ my: 1 }}
                        noOptionsText='Пусто'
                        inputValue={inputValue2}
                        onInputChange={(event, newInputValue) => {
                            setInputValue2(newInputValue);
                            if(newInputValue.length>0){ 
                                getUke(inputValue2);
                            }
                        }}
                        onChange={(event, newValue) => {
                            // console.debug(event);
                            // if (event?.type === "change") {
                            //     setInputValue2(newValue.label);
                            // }
                            handleChangeToriUke('uke', newValue)}}
                        fullWidth
                    /> */}
                    <TextField 
                        onChange={handleChange}
                        id="input-with-sx" 
                        label="Регион" 
                        type='text'
                        name="region" 
                        sx={{ my: 1 }}
                        variant="outlined" 
                        fullWidth
                    />
                    <TextField 
                        onChange={handleChange}
                        id="input-with-sx" 
                        label="Раунд выступления" 
                        type='number'
                        name="round" 
                        sx={{ my: 1 }}
                        variant="outlined" 
                        fullWidth
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={submitPair}>Организовать</Button>
            </DialogActions>
        </Dialog>
    )
}