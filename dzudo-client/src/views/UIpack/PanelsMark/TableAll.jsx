import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";

import CustomTabPanel from "./OnePanel";
import { SocketContext } from "../../../context/SocketProvider";
import { saveEvaluations } from "../../../core/Api/ApiData/methods/event";
import { useSelector } from "react-redux";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TableAll() {
    const [value, setValue] = useState(0);
    const { socketAuth } = useContext(SocketContext);
    const currentPair = useSelector(state => state.user.currentPair);

    const [gradesGiven1, setGradesGiven1] = useState([]);
    const [gradesGiven2, setGradesGiven2] = useState([]);
    const [gradesGiven3, setGradesGiven3] = useState([]);
    const [gradesGiven4, setGradesGiven4] = useState([]);
    const [gradesGiven5, setGradesGiven5] = useState([]);

    const saveData = () => {
        const allEvaluations = [
            ...gradesGiven1,
            ...gradesGiven2,
            ...gradesGiven3,
            ...gradesGiven4,
            ...gradesGiven5,
        ];
        saveEvaluations(allEvaluations, currentPair.id).then(resp => {
            console.debug(resp);
        })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        function onSaveReferee(value) {
            console.debug("referee", value)
            if (gradesGiven1.length == 0) {
                setGradesGiven1(value);
            } else if (gradesGiven2.length == 0) {
                setGradesGiven2(value);
            } else if (gradesGiven3.length == 0) {
                setGradesGiven3(value);
            } else if (gradesGiven4.length == 0) {
                setGradesGiven4(value);
            } else if (gradesGiven5.length == 0) {
                setGradesGiven5(value);
            }
        }

        socketAuth.on('save-evaluations-referee', onSaveReferee);


        return () => {
            socketAuth.off('save-evaluations-referee', onSaveReferee);
        }
    }, [socketAuth, gradesGiven1, gradesGiven2, gradesGiven3, gradesGiven4, gradesGiven5])

    return (
        <Grid container>
            <Grid sx={{ width: '100%' }}>
                <Grid sx={{ overflowX:'auto', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        <Tab label="Судья 1" {...a11yProps(0)} />
                        <Tab label="Судья 2" {...a11yProps(1)} />
                        <Tab label="Судья 3" {...a11yProps(2)} />
                        <Tab label="Судья 4" {...a11yProps(3)} />
                        <Tab label="Судья 5" {...a11yProps(4)} />
                    </Tabs>
                </Grid>
                <Grid mt={1}>
                    <CustomTabPanel value={value} index={0} gradesGiven={gradesGiven1} setGradesGiven={setGradesGiven1} />
                    <CustomTabPanel value={value} index={1} gradesGiven={gradesGiven2} setGradesGiven={setGradesGiven2} />
                    <CustomTabPanel value={value} index={2} gradesGiven={gradesGiven3} setGradesGiven={setGradesGiven3} />
                    <CustomTabPanel value={value} index={3} gradesGiven={gradesGiven4} setGradesGiven={setGradesGiven4} />
                    <CustomTabPanel value={value} index={4} gradesGiven={gradesGiven5} setGradesGiven={setGradesGiven5} />
                </Grid>
            </Grid>
            <Grid my={1} container display='flex' justifyContent='center'>
                <Button onClick={saveData} variant="outlined" color="success">Сохранить</Button>
            </Grid>
        </Grid>

    )
}