import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPairs, setPair } from "../../../core/Api/ApiData/methods/pairs";
import { getUsers } from "../../../core/Api/ApiData/methods/admin";
import toast from "react-hot-toast";
import { ShortName } from "../../../features/functions";
import StandartAutocomplete from "../../UIpack v2/StandartAutocomlete/StandartAutocomplete";


export default function ModalGames({open, setOpen, setPairs, event_id}){
    const [users, setUsers] = useState([]);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [data, setData] = useState({});

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
            setData({});
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
                setData({event_id: event_id})
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
                    <StandartAutocomplete 
                        label={"Tori"}
                        id="tori"
                        options={users}
                        value={data['tori'] || 0}
                        sx={{ my: 1 }}
                        noOptionsText='Пусто'
                        inputValue={inputValue1 || ''}
                        onInputChange={(event, newInputValue) => {
                            setInputValue1(newInputValue);
                            if(newInputValue.length>0){ 
                                getToriUke(inputValue1);
                            }
                        }}
                        onChange={(event, newValue) => {data['tori'] = newValue?.id ? newValue.id : 0; setData(data); setUsers([]); }}
                        fullWidth
                    />
                    <StandartAutocomplete 
                        label={"Uke"}
                        id="uke"
                        options={users}
                        value={data['uke'] || 0}
                        sx={{ my: 1 }}
                        noOptionsText='Пусто'
                        inputValue={inputValue2 || ''}
                        onInputChange={(event, newInputValue) => {
                            setInputValue2(newInputValue);
                            if(newInputValue.length>0){ 
                                getToriUke(inputValue2);
                            }
                        }}
                        onChange={(event, newValue) => {data['uke'] = newValue?.id ? newValue.id : 0; setData(data); setUsers([]); }}
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