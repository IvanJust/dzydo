import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPairs, setPair } from "../../../core/Api/ApiData/methods/pairs";
import { getUsers } from "../../../core/Api/ApiData/methods/admin";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";


export default function ModalGames({open, setOpen, setPairs}){
    const [users, setUsers] = useState([]);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const eventId = useSelector((state) => state.user.eventInfo.id)
    const [data, setData] = useState([]);

    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        getUsers().then((resp) => {
            setUsers(resp.data.map(item => {return {'label': `${item.lastname} ${item.firstname.substr(0, 1)}. ${item.patronymic.substr(0, 1)}.`, 'id': item.id}}));
            data['event_id'] = eventId;
            setData(data);
        });
        return () => {
            data['event_id'] = eventId;
            setData(data);
        }
    }, []);

    const handleChange = (event) => {
        data[event.target.name] = event.target.value;
        setData(data)
    }

    const submitPair = () => {
            setPair(data.event_id, data.tori, data.uke, data.region, data.round).then(resp => {
                if(resp){
                    toast.success('Пара создана');
                    getPairs(data.event_id, "").then(re => {
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
                    {/* <DialogContentText>
                    </DialogContentText> */}
                    <Autocomplete
                        id="tori"
                        options={users}
                        value={data.tori}
                        data-name='tori'
                        onChange={(event, newValue) => {data['tori'] = newValue.id; setData(data); console.debug(data)}}
                        inputValue={inputValue1}
                        onInputChange={(event, newInputValue) => {
                            setInputValue1(newInputValue);
                        }}
                        sx={{ my: 1 }}
                        renderInput={(params) => <TextField {...params} label="Tori" />} 
                        fullWidth
                    />
                    <Autocomplete
                        id="uke"
                        options={users}
                        value={data.uke}
                        name='uke'
                        sx={{ my: 1 }}
                        onChange={(event, newValue) => {data['uke'] = newValue.id; setData(data); console.debug(data)}}
                        inputValue={inputValue2}
                        onInputChange={(event, newInputValue) => {
                            setInputValue2(newInputValue);
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
                    {/* <Select
                        onChange={props.onChange}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="id_event"
                        label="Мероприятие"
                        >
                            {events.map((event) => (
                                <MenuItem value={event.id}>{event.name}</MenuItem>
                            ))}
                    </Select> */}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={submitPair}>Организовать</Button>
            </DialogActions>
        </Dialog>
    )
}