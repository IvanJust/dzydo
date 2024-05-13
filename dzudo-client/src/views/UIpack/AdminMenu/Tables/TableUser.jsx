import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination, Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getCount, getUsersForTable, setAdmin, unsetAdmin } from "../../../../core/Api/ApiData/methods/admin";
import toast from "react-hot-toast";


export default function TableUsers() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getUsersForTable(rowsPerPage, String(newPage)).then((resp) => {
            setUsers(resp.data);
        });
    };

    const handleChangeRowsPerPage = (event) => {
        const newPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newPerPage);
        setPage(0);
        getUsersForTable(newPerPage, String(0)).then((resp) => {
            setUsers(resp.data);
        });
    };

    const setAdm = (id_user) => {
        setAdmin(id_user).then(resp => {
            if (resp.data) {
                setUsers(
                    users.map(item => {
                        if (item.user_id == id_user) return { ...item, admin: 1 };
                        else return item;
                    })
                );
                toast.success('Пользователь назначен администратором')
            }
        }).catch(error => {
            toast.error('Не удалось назначить пользователя администратором')
        })
    }

    const unsetAdm = (id_user) => {
        unsetAdmin(id_user).then(resp => {
            if (resp.data) {
                setUsers(
                    users.map(item => {
                        if (item.user_id == id_user) return { ...item, admin: 0 };
                        else return item;
                    })
                );
                toast.success('Пользователь теперь не администратор')
            }
        }).catch(error => {
            toast.error('Не удалось снять права администратора у пользователя')
        })
    }

    useEffect(() => {
        getCount('user').then(response => {
            if(response.data){
                setCount(response.data.count);
                getUsersForTable(rowsPerPage, String(page)).then((resp) => {
                    setUsers(resp.data);
                });
            }
        })
    }, []);

    return (
        <Grid item>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">№</TableCell>
                            <TableCell>Фамилия</TableCell>
                            <TableCell>Имя</TableCell>
                            <TableCell>Отчество</TableCell>
                            <TableCell align="center">Логин</TableCell>
                            <TableCell align="center">Администратор</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.user_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" align="center">{user.user_id}</TableCell>
                                <TableCell>{user.lastname}</TableCell>
                                <TableCell>{user.firstname}</TableCell>
                                <TableCell>{user.patronymic && user.patronymic}</TableCell>
                                <TableCell align="center">{user.login}</TableCell>
                                <TableCell align="center">{user.admin ? <Grid><Typography fontSize={14}>Да</Typography><Button color="primary" variant="contained" size="small" onClick={() => unsetAdm(user.user_id)}>Убрать права администратора</Button></Grid> : <Grid><Typography fontSize={14}>Нет</Typography><Button color="success" variant="contained" size="small" onClick={() => setAdm(user.user_id)}>Назначить администратором</Button></Grid>}</TableCell>
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
                                labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} из ${count !== -1 ? count : `Показать больше чем ${to}`}`; }}
                                labelRowsPerPage='Число отображаемых строк'
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'Число отображаемых строк',
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
        </Grid>
    )
}


