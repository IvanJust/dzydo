import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { getEvent, getEvents, getTable } from "../../../core/Api/ApiData/methods/event";
import { ShortName, getDateFromSQL } from "../../../features/functions";
import { useDispatch, useSelector } from "react-redux";
import { setEvent, unsetEvent } from "../../../store/slices/tableResultSlice";
import { SocketContext } from "../../../context/SocketProvider";

import logo from '../../../images/logo-dzudo.png';
import "./TableResult-style.css";
import { useNavigate } from "react-router-dom";

export default function TableResult() {
    const [pairs, setPairs] = useState([
        {
            "tori": {
                "id": 1,
                "lastname": "Скворцов",
                "firstname": "Олег",
                "patronymic": "Сергеевич",
                "login": "skv",
                "password": "1"
            },
            "uke": {
                "id": 2,
                "lastname": "Кондырев",
                "firstname": "Олег",
                "patronymic": "Владимирович",
                "login": "kov",
                "password": "2"
            },
            "region": "Пенз. обл.",
            "event": {
                "id": 1,
                "name": "Всероссийское соревнование по дзюдо-кате № 10",
                "place": "город Пенза, просп. Строителей, 96 подъезд 6",
                "date_begin": "2024-04-05",
                "date_end": "2024-05-05"
            },
            "round": 1,
            "condition": 0
        }
    ]);

    const [events, setEvents] = useState([]);
    const tableResult = useSelector((state) => state.tableResult);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { socketAuth, isConnected } = useContext(SocketContext);

    console.debug(isConnected, pairs, tableResult);

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
    
    useEffect(() => {
        function onTable(table) {
            setPairs(table);
            console.debug(table);
        }

        socketAuth.on('table-get', onTable);
        return () => {
            socketAuth.off('table-get', onTable);
        }
    }, [socketAuth])

    const changeSelect = (event) => {
        getEvent(event.target.value).then(resp => {
            dispatch(setEvent(resp.data[0]))
            getTable(event.target.value).then(resp => {
                setPairs(resp.data);
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
                                        label="Выберете соревнования"
                                        onChange={changeSelect}
                                    >
                                        {events.map((event) => (
                                            <MenuItem value={event.id}>{event.name}</MenuItem>
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
                                        label="Выберете соревнования"
                                        onChange={changeSelect}
                                    >
                                        {events.map((event) => (
                                            <MenuItem value={event.id}>{event.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        }
                    </Grid>
                </Grid>
                {tableResult.id > 0 && <Grid container>
                    <TableContainer component={Paper} sx={{mx: 1}}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>№</TableCell>
                                    <TableCell>Tori - Uke</TableCell>
                                    <TableCell>Country</TableCell>
                                    <TableCell>Points</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pairs.length > 0 && pairs.map((pair) => (
                                    <TableRow
                                        key={pair.event.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{++i}</TableCell>
                                        <TableCell sx={{ cursor: 'pointer' }}>{ShortName(pair.tori)} - {ShortName(pair.uke)}</TableCell>
                                        <TableCell>{pair.region}</TableCell>
                                        <TableCell>{pair.points}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>}
            </Grid>
        </Grid>
    );
}