import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getCurrentEvent, getEvents } from "../../../core/Api/ApiData/methods/event";
import toast from "react-hot-toast";


export default function SelectEvent({ effect, onChange, value, curr, isFull }){
    const [events, setEvents] = useState([{id: 1, name: 'Всероссийское соревнование по дзюдо-кате № 10'}]);
    useEffect(() => {
        if(!curr){
            getEvents().then((resp) => {
                if(resp.data){
                    setEvents(resp.data);
                }
            });
        }else{
            getCurrentEvent().then((resp) => {
                if(resp.data){
                    setEvents(resp.data);
                }
            }).catch(err => {
                if(err){
                    toast.error("Ошибка получения мероприятий");
                }
            });
        }
        
        return () => {
            setEvents([]);
        }
    }, [effect]);

    const onChangeInner = (event) => {
        const eventId = event.target.value;
        if(isFull){
            onChange(events.find(it=>it.id == eventId));
        }else{
            onChange(event);
        }
    }
    return(
        <FormControl variant="standard" fullWidth>
            <InputLabel id="demo-simple-select-label">Мероприятие</InputLabel>
            <Select
                onChange={onChangeInner}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="id_event"
                label="Мероприятие"
                value={value}
                >
                    <MenuItem value={0}>Не выбрано</MenuItem>
                    {events.map((event) => (
                        <MenuItem value={event.id} key={event.id}>{event.name}</MenuItem>
                    ))}
            </Select>
        </FormControl>
    )
}