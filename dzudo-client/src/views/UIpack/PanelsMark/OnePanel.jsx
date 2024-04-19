import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, Grid, Tab, Tabs, TextField, Typography } from "@mui/material";
import { getEvaletionCriteria, getMarks, saveEvaluations } from "../../../core/Api/ApiData/methods/event";
import { useSelector } from "react-redux";

function OneMark({ mark, gradesOnRow, funSetMark, criteriaId }) {

    const checkedItems = gradesOnRow.filter(it =>
        it.mark_id == mark.id
    );

    const countChecked = checkedItems.length;

    const renderButtons = (count) => {
        const btns = [];
        for (let index = 0; index < count; index++) {
            //TODO добавить проверки на клик
            btns.push(<Checkbox sx={{p: {xs: 0.3, md : 1}, size: {sx: 'small', md: 'default'}}} key={index} checked={index < countChecked} onChange={(event) => funSetMark(mark, criteriaId, event.target.checked)} />)
        }
        return btns;
    }
    return renderButtons(mark.max)

}

function RowTitle({ marks, ...props }){


    return(
        <Grid container rowSpacing={1} columnSpacing={{ xs: 0, sm: 0, md: 1 }} sx={{ display:'sticky' }}>
            <Grid item xs={1} md={1}>
                <Typography sx={{fontSize: {sx: 12, md: 14}}} >№</Typography>
            </Grid>
            <Grid item xs={3} md={3}>
                <Typography sx={{fontSize: {sx: 12, md: 14}}}>TECHNIQUES</Typography>
            </Grid>
            <Grid item xs={7} md={7} display='flex' flexDirection='row' justifyContent='space-evenly'>
                {marks.map((mark) => (
                    <Typography sx={{fontSize: {sx: 12, md: 14}}}>
                        {mark.name}
                    </Typography>
                ))}
            </Grid>
            <Grid item xs={1} md={1}>
                <Typography sx={{fontSize: {sx: 12, md: 14}}}>
                    Очки
                </Typography>
            </Grid>
        </Grid>
    )
}

function RowTab({ marks, name, criteriaId, funSetMark, gradesGiven, score, ...props }) {
    // console.debug(gradesGiven)

    const gradesOnRow = gradesGiven.filter(it => it.evaluation_criteria_id == criteriaId);
    const credit = gradesOnRow.reduce((partialSum, it) => partialSum + it.score, 0);
    return (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 0, sm: 0, md: 1 }} sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Grid item xs={1} md={1}>
                {criteriaId}
            </Grid>
            <Grid item  xs={3} md={3}>
                {name}
            </Grid>
            <Grid item xs={7} md={7} display='flex' flexDirection='row' justifyContent='space-evenly'>
                {marks.map((mark) => (
                    <Grid item>
                        <OneMark mark={mark} gradesOnRow={gradesOnRow} funSetMark={funSetMark} criteriaId={criteriaId} key={mark.id} />
                    </Grid>
                ))}
            </Grid>
            <Grid item xs={1} md={1}>
                {props.isName && 'Score'}
                {props.isScore && score - credit}
            </Grid>
        </Grid>
    )
}

export default function CustomTabPanel({ children, value, index, gradesGiven, setGradesGiven, ...other }) {
    const [evaletionCriteries, setEvaletionCriteries] = useState([]);
    const [marks, setMarks] = useState([]);
    const currentPair = useSelector(state => state.user.currentPair);

    const allCredit = gradesGiven.reduce((partialSum, it) => partialSum + it.score, 0);
    const allDebet = evaletionCriteries.reduce((partialSum, it) => partialSum + it.init_value, 0);

    useEffect(()=>{
        setGradesGiven([]);
    }, [currentPair])

    useEffect(() => {
        getMarks().then((resp) => {
            setMarks(resp.data);
        });
        getEvaletionCriteria().then((resp) => {
            setEvaletionCriteries(resp.data);
        });
    }, []);


    function setGiveMark(mark, criteria_id, isAdd) {
        const findMark = gradesGiven.findIndex(it =>
            it.evaluation_criteria_id == criteria_id && it.mark_id == mark.id
        )

        if (isAdd) {
            setGradesGiven(
                gradesGiven.concat({
                    pair_id: currentPair.id,
                    evaluation_criteria_id: criteria_id,
                    mark_id: mark.id,
                    score: mark.score,      //нужно тока для фронта, беку не нужно
                })
            )
        } else {
            setGradesGiven(
                gradesGiven.filter((it, ind) =>
                    ind != findMark
                )
            )
        }
    }




    return (
        <>
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Grid sx={{px:{sx: 0, md:2}}} >
                        <RowTitle isName marks={marks}/>
                        {evaletionCriteries.map((criteria) => (
                            <RowTab name={criteria.evaluation_criteria} isScore={true} marks={marks} criteriaId={criteria.id} score={criteria.init_value} funSetMark={setGiveMark} gradesGiven={gradesGiven} key={criteria.id} />
                        ))}
                        <Box display='flex' flexDirection='row' justifyContent='flex-end'>
                            <Box display='flex' alignItems='center'>
                                <Typography mx={1} fontFamily='monospace'> Сумма:  </Typography>
                            </Box>
                            <TextField mx={1} disabled variant="outlined" size="small" sx={{width:'3.5rem'}} value={allDebet - allCredit}/>
                        </Box>
                    </Grid>
                )}
            </div>
        </>

    );
}

