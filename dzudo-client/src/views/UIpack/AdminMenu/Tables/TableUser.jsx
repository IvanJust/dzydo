import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination } from "@mui/material";
import * as React from "react";
import { getUsers } from "../../../../core/Api/ApiData/methods/admin";


export default function TableUsers(){
    const [users, setUsers] = React.useState([]); 
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    React.useEffect(() => {
        getUsers().then((resp) => {
            setUsers(resp.data);
        });
    }, []);

    return(
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell align="center">№</TableCell>
                    <TableCell>Фамилия</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Отчество</TableCell>
                    <TableCell align="right">Логин</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    { (rowsPerPage > 0
                        ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : users
                    ).map((user) => (
                    <TableRow
                    key={user.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row" align="center">{user.id}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.patronymic && user.patronymic}</TableCell>
                    <TableCell align="right">{user.login}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'Все', value: -1 }]}
                        colSpan={3}
                        count={users.length}
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


