import React, { useEffect, useState } from "react";
import { Box, Checkbox, Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { getEvaletionCriteria, getMarks } from "../../../core/Api/ApiData/methods/event";
import { useSelector } from "react-redux";
import "./mark-style.css"
import { green, grey, orange, purple, red } from "@mui/material/colors";

const arrColorCheckBox = [
    {color: green[600], checked: green[400]},
    {color: orange[600], checked: orange[400]},
    {color: purple[600], checked: purple[400]},
    {color: red[600], checked: red[400]},
    {color: grey[600], checked: grey[400]},
    {color: grey[600], checked: grey[400]},
];

const styleArray = {
    fontSize: {xs: 11, sm: 12, md: 14},
    rotate: {xs: '-45deg', sm: '0deg', md: '0deg'},
    px: {md: 1},
}

function OneMark({ mark, gradesOnRow, funSetMark, criteriaId, disabled }) {

    const checkedItems = gradesOnRow.filter(it =>
        it.mark_id == mark.id
    );
    const countChecked = checkedItems.length;

    const renderButtons = (count) => {
        const btns = [];
        for (let index = 0; index < count; index++) {
            //TODO добавить проверки на клик
            btns.push(<Checkbox disabled={disabled && checkedItems.length < Math.round(gradesOnRow.length/2) && index >= countChecked ? disabled : false} sx={{p: {xs: 0.1, md : 0.4}, size: {sx: 'small', md: 'default'}, color: arrColorCheckBox[mark.id - 1].color, '&.Mui-checked': {color: arrColorCheckBox[mark.id-1].checked}}} key={index} checked={index < countChecked} onChange={(event) => funSetMark(mark, criteriaId, event.target.checked)} />)
        }
        return btns;
    }
    return renderButtons(mark.max)

}

function RowTitle({ marks, ...props }){


    return(
        <>
            <Divider />
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 2 }} sx={{ display:'sticky', pt: {xs: 3, sm: 0, md: 0} }}>
                <Grid item xs={1} md={1}>
                    <Typography sx={{fontSize: styleArray.fontSize, px: styleArray.px}} >№</Typography>
                </Grid>
                <Grid item xs={3} md={3}>
                    <Typography sx={{textAlign: {xs: 'center', sm: 'start', md: 'start'}, fontSize: styleArray.fontSize, px: styleArray.px, rotate: styleArray.rotate}}>TECHNIQUES</Typography>
                </Grid>
                <Grid item xs={7} md={7} display='flex' flexDirection='row' justifyContent='space-evenly'>
                    {marks.map((mark) => (
                        <Typography key={mark.id} sx={{textAlign: 'center', fontSize: styleArray.fontSize, px: styleArray.px, rotate: styleArray.rotate, color: arrColorCheckBox[mark.id - 1]}}>
                            {mark.name}
                        </Typography>
                    ))}
                </Grid>
                <Grid item xs={1} md={1}>
                    <Typography sx={{fontSize: styleArray.fontSize, px: styleArray.px, rotate: styleArray.rotate}}>
                        Очки
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{mt: {xs: 3, sm: 0, md: 0}}}/>
        </>
    )
}

function RowTab({ marks, name, criteriaId, funSetMark, gradesGiven, score, ...props }) {
    // console.debug(gradesGiven)

    const gradesOnRow = gradesGiven.filter(it => it.evaluation_criteria_id == criteriaId);
    const credit = gradesOnRow.reduce((partialSum, it) => partialSum + it.score, 0);
    return (
        <>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 0, sm: 0, md: 1 }} sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Grid item xs={1} md={1}>
                    <Typography sx={{fontSize: styleArray.fontSize, px: styleArray.px}} >{criteriaId}</Typography>
                </Grid>
                <Grid item  xs={3} md={3}>
                    <Typography sx={{fontSize: styleArray.fontSize, px: styleArray.px}} >{name}</Typography>
                </Grid>
                <Grid item xs={7} md={7} display='flex' flexDirection='row' justifyContent='space-around'>
                    {marks.map((mark) => (
                        <Grid item key={mark.id}>
                            <OneMark mark={mark} gradesOnRow={gradesOnRow} disabled={ score - credit - mark.score <= 0 || score - credit - mark.score > 10 } funSetMark={funSetMark} criteriaId={criteriaId} key={mark.id} />
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={1} md={1}>
                    <Typography sx={{textAlign: 'center', fontSize: styleArray.fontSize, px: styleArray.px}} >
                        {props.isName && 'Score'}
                        {props.isScore && score - credit}
                    </Typography>
                </Grid>
            </Grid>
            <Divider/>
        </>
    )
}

export default function CustomTabPanel({ children, value, index, gradesGiven, setGradesGiven, ...other }) {
    const [evaletionCriteries, setEvaletionCriteries] = useState([]);
    const [marks, setMarks] = useState([]);
    const currentPair = useSelector(state => state.user.currentPair);

    const allCredit = gradesGiven.reduce((partialSum, it) => partialSum + it.score, 0);
    
    const allDebet = evaletionCriteries.reduce((partialSum, it) => partialSum + it.init_value, 0);

    const isHasForgotten = gradesGiven.findIndex(it=> it.mark_id == 4) != -1;

    let allScore = allDebet - allCredit;
    if(isHasForgotten){
        allScore /= 2;
    }

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
                style={{overflow: 'auto'}}
            >
                {value === index && (
                    <Stack direction='column' sx={{p:{sx: 2, md:3}}} >
                        <RowTitle isName marks={marks}/>
                        {evaletionCriteries.map((criteria) => (
                            <RowTab name={criteria.evaluation_criteria} isScore={true} marks={marks} criteriaId={criteria.id} score={criteria.init_value} funSetMark={setGiveMark} gradesGiven={gradesGiven} key={criteria.id} />
                        ))}
                        <Box mt={1} display='flex' flexDirection='row' justifyContent='flex-end'>
                            <Box display='flex' alignItems='center'>
                                <Typography mx={1} fontFamily='monospace'> Сумма:  </Typography>
                            </Box>
                            <TextField mx={1} disabled variant="outlined" size="small" sx={{width:'4.5rem'}} value={allScore}/>
                        </Box>
                    </Stack>
                )}
            </div>
        </>

    );
}

