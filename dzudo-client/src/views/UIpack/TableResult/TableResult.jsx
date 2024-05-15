import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { getEvent, getEvents, getTable, getTable2 } from "../../../core/Api/ApiData/methods/event";
import { getDateFromSQL } from "../../../features/functions";
import { useDispatch, useSelector } from "react-redux";
import { setEvent, unsetEvent } from "../../../store/slices/tableResultSlice";
import { SocketContext } from "../../../context/SocketProvider";

import logo from '../../../images/logo-dzudo.png';
import "./TableResult-style.css";
import { useNavigate } from "react-router-dom";
import TableOchki from "../../UIpack v2/TableOchki/TableOchki";
import { getRefereeFromEvent } from "../../../core/Api/ApiData/methods/admin";

export default function TableResult() {
    const [pairs, setPairs] = useState([]);
    const [selectEvent, setSelectEvent] = useState('');
    const [events, setEvents] = useState([]);
    const [data, setData] = useState([]);
    const tableResult = useSelector((state) => state.tableResult);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { socketAuth, isConnected } = useContext(SocketContext);

    useEffect(() => {
        getEvents().then(resp => {
            if (resp.data) {
                setEvents(resp.data);
            }
        });
        return () => {
            dispatch(unsetEvent());
        }
    }, [])

    useEffect(() => { // обновление таблицы по сокету после сохранения супервайзера
        function setDataTable(value){
            if(value){
                setData(data.concat(value.pair).sort((a, b) => a.referee.reduce((acc, obj) => acc + obj.sum, 0) - b.referee.reduce((acc, obj) => acc + obj.sum, 0)).reverse());
            }
        }
        socketAuth.on('save-table-supervisor', setDataTable);
        return () => {
            socketAuth.off('save-table-supervisor', setDataTable);
        }
    }, [socketAuth, data]);

    const changeSelect = (event) => {
        setSelectEvent(event.target.value);
        getEvent(event.target.value).then(resp => {
            dispatch(setEvent(resp.data[0]))
            getTable2(event.target.value).then(resp => {
                setData(resp.data);
            })
        });
    }
    
    function goTo(nav){
        navigate("/"+nav, {replace: true});
    }

    let i = 0;

    return (
        <Grid container className="page" sx={{height: '100vh'}}>
            <Grid sx={{ width: '100%'}} display={'flex'} flexDirection={'column'}>
                <Grid container py={2} sx={{ display: { xs: 'flex', md: 'none' }}}>
                    <Grid container sx={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Box className="header-logo" sx={{ display: { xs: 'flex', md: 'none' }, ml: 1, cursor: 'pointer' }}>
                            <img onClick={() => goTo('')} title="Дзюдо-Ката" src={logo}/>
                        </Box>
                        {tableResult.id > 0 && <Grid sx={{mr: 2}}>
                            <Box><Typography fontSize={18}>{tableResult.name}</Typography></Box>
                            <Box><Typography>{tableResult.place}</Typography></Box>
                            <Box><Typography>{getDateFromSQL(tableResult.dateBegin)} - {getDateFromSQL(tableResult.dateEnd)}</Typography></Box>
                        </Grid>}
                    </Grid>
                    <Grid container sx={{justifyContent: 'center'}}>
                        {tableResult.id == 0 &&
                            <Box>
                                <Grid container alignContent='center' justifyContent='center'><Typography fontSize={18}>Выбирете соревнования для трансляции</Typography></Grid>
                                <FormControl variant="standard" sx={{width: 'auto', display:'flex', justifyContent:'center'}} fullWidth>
                                    <InputLabel id="demo-simple-select-label">Соревнования</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="id_event"
                                        value={selectEvent}
                                        label="Выберете соревнования"
                                        onChange={changeSelect}
                                    >
                                        {events.map((event) => (
                                            <MenuItem value={event.id} key={event.id}>{event.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        }
                    </Grid>
                </Grid>
                <Grid container py={2} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Box className="header-logo" sx={{ position: 'absolute', left: '1rem', cursor: 'pointer'}}>
                        <img onClick={() => goTo('')} title="Дзюдо-Ката" src={logo}/>
                    </Box>
                    <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        {tableResult.id > 0 && <>
                            <Box><Typography fontSize={18}>{tableResult.name}</Typography></Box>
                            <Box><Typography>{tableResult.place}</Typography></Box>
                            <Box><Typography>{getDateFromSQL(tableResult.dateBegin)} - {getDateFromSQL(tableResult.dateEnd)}</Typography></Box>
                        </>}
                        {tableResult.id == 0 &&
                            <Box>
                                <Grid container alignContent='center' justifyContent='center'><Typography fontSize={18}>Выбирете соревнования для трансляции</Typography></Grid>
                                <FormControl variant="standard" sx={{width: 'auto', display:'flex', justifyContent:'center'}} fullWidth>
                                    <InputLabel id="demo-simple-select-label">Соревнования</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="id_event"
                                        value={selectEvent}
                                        label="Выберете соревнования"
                                        onChange={changeSelect}
                                    >
                                        {events.map((event) => (
                                            <MenuItem value={event.id} key={event.id}>{event.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        }
                    </Grid>
                </Grid>
                {tableResult.id > 0 && <Grid sx={{m: 1}}>
                    <TableOchki data={data} />
                </Grid>}
            </Grid>
        </Grid>
    );
}