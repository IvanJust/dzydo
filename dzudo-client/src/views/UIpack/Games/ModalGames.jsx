import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPairs, setPair } from "../../../core/Api/ApiData/methods/pairs";
import { getUsers } from "../../../core/Api/ApiData/methods/admin";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ShortName } from "../../../features/functions";


export default function ModalGames({open, setOpen, setPairs, event_id}){
    const [users, setUsers] = useState([]);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [data, setData] = useState([]);

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
            data['event_id'] = event_id;
            setData(data);
        return () => {
            setUsers([]);
            setInputValue1('');
            setInputValue2('');
            setData([]);
        }
    }, []);

    function getToriUke(input){
        if(input.length > 0){
            getUsers(input).then((resp) => {
                setUsers(resp.data.map(item => {return {'label': ShortName(item), 'id': item.user_id}}));
            });
            return true;
        }else{
            return false;
        }
    }

    const handleChange = (event) => {
        data[event.target.name] = event.target.value;
        setData(data)
    }

    const submitPair = () => {
        setPair(data.event_id, data.tori, data.uke, data.region, data.round).then(resp => {
            if(resp){
                toast.success('Пара создана');
                getPairs(data.event_id).then(re => {
                    setPairs(re.data);
                    handleClose();
                })
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
                    <Autocomplete
                        id="tori"
                        options={users}
                        value={data['tori']}
                        data-name='tori'
                        sx={{ my: 1 }}
                        noOptionsText='Пусто'
                        onChange={(event, newValue) => { data['tori'] = newValue?.id ? newValue.id : 0; setData(data); setUsers([]); }}
                        inputValue={inputValue1 || ''}
                        onInputChange={(event, newInputValue) => {
                            setInputValue1(newInputValue);
                            if(newInputValue.length>0){ 
                                getToriUke(inputValue1);
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="Tori" />} 
                        fullWidth
                    />
                    <Autocomplete
                        id="uke"
                        options={users}
                        value={data['uke']}
                        name='uke'
                        sx={{ my: 1 }}
                        noOptionsText='Пусто'
                        onChange={(event, newValue) => {data['uke'] = newValue?.id ? newValue.id : 0; setData(data); setUsers([]);}}
                        inputValue={inputValue2 || ''}
                        onInputChange={(event, newInputValue) => {
                            setInputValue2(newInputValue);
                            if(newInputValue.length>0) {
                                getToriUke(inputValue2);
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="Uke" />} 
                        fullWidth
                    />
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