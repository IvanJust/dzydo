import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, Grid, Tab, Tabs, Typography } from "@mui/material";
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
            btns.push(<Checkbox key={index} checked={index < countChecked} onChange={(event) => funSetMark(mark, criteriaId, event.target.checked)} />)
        }
        return btns;
    }
    return renderButtons(mark.max)

}

function RowTab({ marks, name, criteriaId, funSetMark, gradesGiven, score, ...props }) {
    // console.debug(gradesGiven)

    const gradesOnRow = gradesGiven.filter(it => it.evaluation_criteria_id == criteriaId);
    const credit = gradesOnRow.reduce((partialSum, it) => partialSum + it.score, 0);
    return (
        <Box my={1} sx={{ flexGrow: 1 }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6} md={1}>
                    {criteriaId}
                </Grid>
                <Grid item xs={6} md={4}>
                    {name}
                </Grid>
                {marks.map((mark) => (
                    <OneMark mark={mark} gradesOnRow={gradesOnRow} funSetMark={funSetMark} criteriaId={criteriaId} key={mark.id} />
                ))}
                <Grid item xs={6} md={1}>
                    {props.isName && 'Score'}
                    {props.isScore && score - credit}
                </Grid>
            </Grid>
        </Box>
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
                    <Grid>
                        {/* <RowTab name='Предварительные встречи' isName={true} marks={marks} id='№' /> */}
                        {evaletionCriteries.map((criteria) => (
                            <RowTab name={criteria.evaluation_criteria} isScore={true} marks={marks} criteriaId={criteria.id} score={criteria.init_value} funSetMark={setGiveMark} gradesGiven={gradesGiven} key={criteria.id} />
                        ))}
                        Сумма {allDebet - allCredit}
                    </Grid>
                )}
            </div>
        </>

    );
}

