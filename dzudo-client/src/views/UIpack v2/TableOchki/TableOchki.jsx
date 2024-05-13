import React, { useEffect, useState } from "react";
import { getTable1 } from "../../../core/Api/ApiData/methods/event";
import { Table, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow } from "@mui/material";
import toast from "react-hot-toast";
import { ShortName } from "../../../features/functions";

function RefereeCol({refer}){
    return(
        <TableCell>{refer?.sum ? refer.sum : 0}</TableCell>
    )
}


export default function TableOchki({event_id, isShowRef, refereeList, pairs}){
    const [data, setData] = useState([]);
    let i = 0;

    useEffect(() => {
        if(event_id > 0){
            getTable1(event_id).then(resp => {
                if(resp.data){
                    setData(resp.data);
                }
            }).catch(error => {
                toast.error('Ошибка получения данных');
                console.debug(error);
            })
        }
    }, [event_id, pairs])

    return (
        <TableContainer component={Paper} sx={{mx: 1}}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>№</TableCell>
                        <TableCell>Region</TableCell>
                        <TableCell>Tori - Uke</TableCell>
                        {isShowRef && refereeList.map((ref, index) => (<TableCell key={index}>Судья {index + 1}</TableCell>))}
                        <TableCell>Points</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0 && data.map((pair) => (
                        <TableRow
                            key={pair.pair_id}
                        >
                            <TableCell>{++i}</TableCell>
                            <TableCell title="Регион">{pair.region}</TableCell>
                            <TableCell sx={{ cursor: 'pointer' }} title="Участники">{ShortName(pair.tori)} - {ShortName(pair.uke)}</TableCell>
                            {isShowRef && refereeList.map((ref, index) => <RefereeCol refer={pair.referee.filter(item => item.referee_id == ref.id).shift()} key={index} />)}
                            <TableCell>{pair.referee.reduce((acc, obj) => acc + obj.sum, 0)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}