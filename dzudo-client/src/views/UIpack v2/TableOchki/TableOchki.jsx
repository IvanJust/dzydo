import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow } from "@mui/material";
import { ShortName } from "../../../features/functions";
import CircleIcon from '@mui/icons-material/Circle';

function RefereeCol({refer}){
    return(
        <TableCell>{refer?.sum ? refer.sum : 0}{refer?.flag ?? <CircleIcon color="success" titleAccess="Супервайзер изменил баллы" sx={{height: '10px', width: '10px'}} />}</TableCell>
    )
}

function RenderPair({isShowRef, refereeList, pair, i}){
    const max = useMemo(() => { Math.max(...pair.referee.map(referee => referee.sum)) }, [pair])
    const min = useMemo(() => { Math.min(...pair.referee.map(referee => referee.sum)) }, [pair])
    return(
        <TableRow>
        <TableCell>{i}</TableCell>
        <TableCell title="Регион">{pair.region}</TableCell>
        <TableCell sx={{ cursor: 'pointer' }} title="Участники">{ShortName(pair.tori)} - {ShortName(pair.uke)}</TableCell>
        {isShowRef && refereeList.map((ref, index) => <RefereeCol refer={pair.referee.filter(item => item.referee_id == ref.id).shift()} key={index} />)}
        <TableCell>{pair.referee.reduce((acc, obj) => acc + obj.sum, 0) - max - min}</TableCell>
    </TableRow>
    )
}


export default function TableOchki({isShowRef, refereeList, data}){
    let i = 0;

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
                        <RenderPair pair={pair} key={pair.pair_id} i={++i} isShowRef={isShowRef} refereeList={refereeList} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}