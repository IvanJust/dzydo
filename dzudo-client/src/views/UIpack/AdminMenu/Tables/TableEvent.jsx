import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination } from "@mui/material";
import * as React from "react";
import { } from "../../../../core/Api/ApiData/methods/admin";
import { getEvents } from "../../../../core/Api/ApiData/methods/event";
import { getDateFromSQL } from "../../../../features/functions";
import { useNavigate } from "react-router-dom";


export default function TableEvents(){
    const [events, setEvents] = React.useState([]); 
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const navigate = useNavigate();
    function ToEvent(event){
        navigate("/games/"+event, {replace: true});
    }

    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - events.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    React.useEffect(() => {
        getEvents().then((resp) => {
            setEvents(resp.data);
        });
    }, []);

    return(
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                    { (rowsPerPage > 0
                        ? events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : events
                    ).map((event) => (
                    <TableRow
                        key={event.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row" align="center">{event.id}</TableCell>
                        <TableCell onClick={() => ToEvent(event.id)} sx={{cursor:'pointer'}} title="Перейти на данное соревнование">{event.name}</TableCell>
                        <TableCell>{event.place}</TableCell>
                        <TableCell>{getDateFromSQL(event.date_begin)}</TableCell>
                        <TableCell>{getDateFromSQL(event.date_end)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'Все', value: -1 }]}
                        colSpan={3}
                        count={events.length}
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
    )
}


