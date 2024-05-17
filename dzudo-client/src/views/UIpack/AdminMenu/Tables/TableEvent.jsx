import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination, Grid, Typography, Button, Dialog, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getCount, getEventsForTable } from "../../../../core/Api/ApiData/methods/admin";
import { getDateFromSQL } from "../../../../features/functions";
import RegistrationStaff from "../Registration/RegistrationStaff";
import InfoMenu from "../../../UIpack v2/InfoMenu/InfoMenu";
import GroupAddIcon from '@mui/icons-material/GroupAdd';


export default function TableEvents(){
    const [events, setEvents] = useState([]); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isShow, setIsShow] = useState(false);
    const [selectEvent, setSelectEvent] = useState(0);
    const [count, setCount] = useState(0);

  
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getEventsForTable(rowsPerPage, String(newPage)).then((resp) => {
            setEvents(resp.data);
        });
    };
    
    const handleChangeRowsPerPage = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        setPage(0);
        setRowsPerPage(newPerPage);
        getEventsForTable(newPerPage, String(0)).then((resp) => {
            setEvents(resp.data);
        });
    };

    const handleClose = () => {
        setIsShow(false);
    }

    const showDialog = (event) => {
        setSelectEvent(event);
        setIsShow(true);
    }

    useEffect(() => {

        getCount('event').then(response => {
            if(response.data){
                setCount(response.data.count);
                getEventsForTable(rowsPerPage, String(page)).then((resp) => {
                    setEvents(resp.data);
                });
            }
        })
        return () => {
            setEvents([]);
            setCount(0);
        }
    }, []);

    return(
        <Grid item>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="center">№</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Место</TableCell>
                        <TableCell>Дата начала</TableCell>
                        <TableCell>Дата окончания</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event) => (
                        <TableRow
                            key={event.id}
                            // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" align="center">{event.id}</TableCell>
                            <TableCell>
                                <Grid container display={"flex"} justifyContent={'space-between'} alignItems={'center'}>
                                    <Grid item>
                                        <Typography>{event.name}</Typography>
                                    </Grid>
                                    <Grid item display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                                        <InfoMenu eventId={event.id} />
                                        <IconButton size="medium" onClick={() => showDialog(event)}><GroupAddIcon titleAccess="Назначить персонал" fontSize="medium" /></IconButton>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>{event.place}</TableCell>
                            <TableCell>{getDateFromSQL(event.date_begin)}</TableCell>
                            <TableCell>{getDateFromSQL(event.date_end)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                            rowsPerPageOptions={[10, 25, { label: 'Все', value: -1 }]}
                            count={count}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelDisplayedRows = {function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} из ${count !== -1 ? count : `Показать больше чем ${to}`}`; }}
                            labelRowsPerPage = 'Выберете число отображаемых строк'
                            slotProps={{
                                select: {
                                    inputProps: {
                                        'aria-label': 'Выберете число отображаемых строк',
                                    },
                                    native: true,
                                },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <Dialog onClose={handleClose} open={isShow}>
                <RegistrationStaff event={selectEvent} handleClose={handleClose} />
            </Dialog>
        </Grid>
    )
}


