import React from "react";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, TextField } from "@mui/material";
import { DateField } from '@mui/x-date-pickers/DateField';
import { Form } from "react-router-dom";



function RegistrationEvent({...props}){
    let date = new Date();
    const defaultDate = date;
    
    return(
        <Grid item>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Card>
                    <CardHeader
                        title='Пожалуйста, заполните все поля'
                    />
                    <CardContent>
                        <Form id="registrationEvent">
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    label="Название соревнований" 
                                    name="name"
                                    type="text"
                                    // autoFocus 
                                    variant="filled" 
                                    required
                                    fullWidth
                                    />
                            </Box>
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    label="Место"
                                    type="text"
                                    name="place" 
                                    variant="filled" 
                                    required
                                    fullWidth
                                    />
                            </Box>
                            <Box my={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    helperText="Дата начала соревнований" 
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    // label
                                    type='date'
                                    name="date_begin" 
                                    variant="filled" 
                                    required
                                    fullWidth
                                    />
                                {/* <DateField 
                                    // defaultValue={defaultDate} 
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    label="Дата начала соревнований" 
                                    // type='date'
                                    name="date" 
                                    variant="filled" 
                                    fullWidth
                                /> */}
                            </Box>
                            <Box mt={2} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'stretch' }}>
                                <TextField 
                                    helperText="Дата конца соревнований" 
                                    onChange={props.onChange}
                                    id="input-with-sx" 
                                    // label
                                    type='date'
                                    name="date_end" 
                                    required
                                    variant="filled" 
                                    fullWidth
                                    />
                            </Box>
                        </Form>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" sx={{ml: 1, mb: 1}} type="submit" onClick={props.onClick}>
                            Организовать соревнование
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}

export default RegistrationEvent;