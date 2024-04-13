import React, { useEffect, useState } from "react";
import { Box, Checkbox, Grid, Tab, Tabs, Typography } from "@mui/material";
import { getEvaletionCriteria, getMarks } from "../../../core/Api/ApiData/methods/event";

function OneMark({ mark, gradesOnRow, funSetMark, criteriaId }) {

    const checkedItems = gradesOnRow.filter(it =>
        it.mark_id == mark.id
    );

    const countChecked = checkedItems.length;

    const renderButtons = (count) => {
        const btns = [];
        for (let index = 0; index < count; index++) {
            btns.push(<Checkbox key={index} checked={index < countChecked} onChange={(event)=>funSetMark(mark.id, criteriaId, event.target.checked)}/>)
        }
        return btns;
    }
    return renderButtons(mark.max)

}

function RowTab({ marks, name, criteriaId, funSetMark, gradesGiven, ...props }) {
    console.debug(gradesGiven)

    const gradesOnRow = gradesGiven.filter(it => it.evaluation_criteria_id == criteriaId);

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
                    <OneMark mark={mark} gradesOnRow={gradesOnRow} funSetMark={funSetMark} criteriaId={criteriaId} />
                ))}
                <Grid item xs={6} md={1}>
                    {props.isName && 'Score'}
                    {props.isScore && '10'}
                </Grid>
            </Grid>
        </Box>
    )
}

export default function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    const [evaletionCriteries, setEvaletionCriteries] = useState([]);
    const [marks, setMarks] = useState([]);

    const [gradesGiven, setGradesGiven] = useState([]);

    useEffect(() => {
        getMarks().then((resp) => {
            setMarks(resp.data);
        });
        getEvaletionCriteria().then((resp) => {
            setEvaletionCriteries(resp.data);
        });
    }, []);


    function setGiveMark(mark_id, criteria_id, isAdd) {
        const findMark = gradesGiven.findIndex(it => 
            it.evaluation_criteria_id == criteria_id && it.mark_id == mark_id
        )

        if(isAdd){
            setGradesGiven(
                gradesGiven.concat({
                    pair_id: 2,
                    evaluation_criteria_id: criteria_id,
                    mark_id: mark_id
                })
            )
        }else{
            setGradesGiven(
                gradesGiven.filter((it, ind) =>
                    ind != findMark
                )
            )
        }
    }


    return (
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
                        <RowTab name={criteria.evaluation_criteria} isScore={true} marks={marks} criteriaId={criteria.id} funSetMark={setGiveMark} gradesGiven={gradesGiven} />
                    ))}
                </Grid>
            )}
        </div>
    );
}

