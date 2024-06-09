import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getPairs, setPair } from "../../../core/Api/ApiData/methods/pairs";
import toast from "react-hot-toast";
import AutocompleteUsers from "../../UIpack v2/AutocompleteUsers/AutocompleteUsers";


export default function ModalGames({ open, setOpen, setPairs, event_id }) {
    const [data, setData] = useState({event_id: event_id});
    const handleClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        setData({event_id: event_id});
        return () => {
            setData({});
        }
    }, [event_id]);

    const handleChange = (event) => {
        setData({...data, [event.target.name]: event.target.value});
    }

    const submitPair = () => {
        setPair(data.event_id, data.tori.id, data.uke.id, data.region, data.round).then(resp => {
            if (resp) {
                toast.success('Пара создана');
                setData({ event_id: event_id })
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

    return (
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
                    <AutocompleteUsers
                        labelTextField={'Tori'}
                        value={data['tori']}
                        onChange={(event, newValue) => { setData({ ...data, tori: newValue }) }}
                        sx={{ my: 1 }}
                    />
                    <AutocompleteUsers
                        labelTextField={'Uke'}
                        value={data['uke']}
                        onChange={(event, newValue) => { setData({ ...data, uke: newValue }) }}
                        sx={{ my: 1 }}
                    />
                    <TextField
                        value={data.region}
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
                        value={data.round}
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