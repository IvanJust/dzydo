import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from "@mui/material";
import React, { useState } from "react";


export default function ModalGames({open, setOpen}){
    const [tori, setTori] = useState([]);
    const [uke, setUke] = useState([]);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const handleClose = () => {
        setOpen(false);
    }
    const handleChange = (event) => {
        console.debug(event);
    }

    return(
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
            component: 'form',
            onSubmit: (event) => {
                // event.preventDefault();
                // const formData = new FormData(event.currentTarget);
                // const formJson = Object.fromEntries(formData.entries());
                // const email = formJson.email;
                // console.log(email);
                // handleClose();
            },
            }}
        >
            <DialogTitle>Окно для организации пары выступления</DialogTitle>
            <DialogContent>
                <Grid container py={1} flexDirection='column' display='flex' justifyContent='center'>
                    {/* <DialogContentText>
                    </DialogContentText> */}
                    <Autocomplete
                        id="tori"
                        options={tori}
                        onChange={handleChange}
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
                        options={uke}
                        sx={{ my: 1 }}
                        onChange={handleChange}
                        inputValue={inputValue2}
                        onInputChange={(event, newInputValue) => {
                          setInputValue2(newInputValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Uke" />} 
                        fullWidth
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button type="submit">Организовать</Button>
            </DialogActions>
        </Dialog>
    )
}