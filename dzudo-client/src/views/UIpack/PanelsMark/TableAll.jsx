import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";

import CustomTabPanel from "./OnePanel";
import { SocketContext } from "../../../context/SocketProvider";
import { saveEvaluations } from "../../../core/Api/ApiData/methods/event";
import { useSelector } from "react-redux";
import CircleIcon from '@mui/icons-material/Circle';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TableAll({secret, data, evaluations, refereeList}) {
    const [value, setValue] = useState(0);
    const { socketAuth } = useContext(SocketContext);
    const currentPair = useSelector(state => state.user.currentPair);
    const [read, setRead] = useState(false);
    const refCount = [];

    const [gradesGiven1, setGradesGiven1] = useState(data[0] || []);
    const [gradesGiven2, setGradesGiven2] = useState(data[1] || []);
    const [gradesGiven3, setGradesGiven3] = useState(data[2] || []);
    const [gradesGiven4, setGradesGiven4] = useState(data[3] || []);
    const [gradesGiven5, setGradesGiven5] = useState(data[4] || []);

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
            setRead(true);
        })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        refereeList.forEach((item, index) => {
            if (index == 1) {
                setGradesGiven1(evaluations.filter(evalu => evalu.referee.id == item.id));
                refCount.push({refId: 1});
            } else if (index == 2) {
                setGradesGiven2(evaluations.filter(evalu => evalu.referee.id == item.id));
                refCount.push({refId: 2});
            } else if (index == 3) {
                setGradesGiven3(evaluations.filter(evalu => evalu.referee.id == item.id));
                refCount.push({refId: 3});
            } else if (index == 4) {
                setGradesGiven4(evaluations.filter(evalu => evalu.referee.id == item.id));
                refCount.push({refId: 4});
            } else if (index == 5) {
                setGradesGiven5(evaluations.filter(evalu => evalu.referee.id == item.id));
                refCount.push({refId: 5});
            }
        });
    }, [])

    useEffect(() => {
        function onSaveReferee(value) {
            console.debug("referee", value)
            if (gradesGiven1.length == 0) {
                setGradesGiven1(value);
                refCount.push({refId: 1});
            } else if (gradesGiven2.length == 0) {
                setGradesGiven2(value);
                refCount.push({refId: 2});
            } else if (gradesGiven3.length == 0) {
                setGradesGiven3(value);
                refCount.push({refId: 3});
            } else if (gradesGiven4.length == 0) {
                setGradesGiven4(value);
                refCount.push({refId: 4});
            } else if (gradesGiven5.length == 0) {
                setGradesGiven5(value);
                refCount.push({refId: 5});
            }
        }
        socketAuth.on('save-evaluations-referee', onSaveReferee);


        return () => {
            socketAuth.off('save-evaluations-referee', onSaveReferee);
        }
    }, [socketAuth, gradesGiven1, gradesGiven2, gradesGiven3, gradesGiven4, gradesGiven5])

    return (
        <>
            <Grid sx={{ width: '100%' }}>
                <Box sx={{ overflowX:'auto', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        <Tab label={<Typography>Судья 1 {(refCount.length == 1 && !read) && <CircleIcon color="success" sx={{ml: 1}} />}</Typography>} {...a11yProps(0)} />
                        <Tab label={<Typography>Судья 2 {(refCount.length == 2 && !read) && <CircleIcon sx={{ml: 1}} />}</Typography>} {...a11yProps(1)} />
                        <Tab label={<Typography>Судья 3 {(refCount.length == 3 && !read) && <CircleIcon sx={{ml: 1}} />}</Typography>} {...a11yProps(2)} />
                        <Tab label={<Typography>Судья 4 {(refCount.length == 4 && !read) && <CircleIcon sx={{ml: 1}} />}</Typography>} {...a11yProps(3)} />
                        <Tab label={<Typography>Судья 5 {(refCount.length == 5 && !read) && <CircleIcon sx={{ml: 1}} />}</Typography>} {...a11yProps(4)} />
                    </Tabs>
                </Box>
                <Grid>
                    <CustomTabPanel value={value} index={0} gradesGiven={gradesGiven1} setGradesGiven={setGradesGiven1} />
                    <CustomTabPanel value={value} index={1} gradesGiven={gradesGiven2} setGradesGiven={setGradesGiven2} />
                    <CustomTabPanel value={value} index={2} gradesGiven={gradesGiven3} setGradesGiven={setGradesGiven3} />
                    <CustomTabPanel value={value} index={3} gradesGiven={gradesGiven4} setGradesGiven={setGradesGiven4} />
                    <CustomTabPanel value={value} index={4} gradesGiven={gradesGiven5} setGradesGiven={setGradesGiven5} />
                </Grid>
            </Grid>
            {!secret && <Grid my={2} container display='flex' justifyContent='center'>
                <Button onClick={saveData} variant="outlined" color="success" disabled={currentPair?.condition != 1 || refCount.length < 5}
                >
                    Сохранить
                </Button>
            </Grid>}
        </>

    )
}