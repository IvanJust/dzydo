import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Grid, Tab, Tabs, Typography } from "@mui/material";

import CustomTabPanel from "./OnePanel";
import { SocketContext } from "../../../context/SocketProvider";
import { getEvaluationsForSecr, getVotedStaff, saveEvaluations } from "../../../core/Api/ApiData/methods/event";
import { useSelector } from "react-redux";
import CircleIcon from '@mui/icons-material/Circle';
import { getForSuper, getPairs } from "../../../core/Api/ApiData/methods/pairs";
import toast from "react-hot-toast";
import { getSupervisorFromEvent } from "../../../core/Api/ApiData/methods/admin";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function TableSecret({refereeList}) {
    const [value, setValue] = useState(0);
    const { socketAuth } = useContext(SocketContext);
    const currentPair = useSelector(state => state.user.currentPair);
    const event = useSelector(state => state.user.eventInfo);
    const [refCount, setRefCount] = useState({});
    const [votedStaff, setVotedStaff] = useState([]);
    const [dataSuper, setDataSuper] = useState([]);
    const [superUser, setSuperUser] = useState({});
    // const [disSaved, setDisSaved] = useState(true);

    const [gradesGiven1, setGradesGiven1] = useState([]);
    const [gradesGiven2, setGradesGiven2] = useState([]);
    const [gradesGiven3, setGradesGiven3] = useState([]);
    const [gradesGiven4, setGradesGiven4] = useState([]);
    const [gradesGiven5, setGradesGiven5] = useState([]);

    const arrGrades = [
        setGradesGiven1,
        setGradesGiven2,
        setGradesGiven3,
        setGradesGiven4,
        setGradesGiven5,
    ]

    function getForSecretAndSetMark(refereeList, votedStaff){
        if(votedStaff.length > 0){
            votedStaff.forEach(item => {
                let ind = refereeList.findIndex(it => it.id == item.user_id);
                if(ind != -1){
                    getForSuper(currentPair.id, item.user_id).then(re => {
                        if(re.data){
                            setMarkEvaluation(re.data, arrGrades[ind]);
                            refCount[ind] = item.user_id;
                            setRefCount({...refCount});
                        }
                    })
                }
            } )
        }
    }

    function setMarkEvaluation(array, setter){
        setter(array.map(element => {return {
            pair_id: currentPair.id,
            evaluation_criteria_id: element.evaluation_criteria.id,
            mark_id: element.mark.id,
            score: element.mark.score,      
        }}));
    }
    // const saveData = () => {
    //     const allEvaluations = [
    //         ...gradesGiven1,
    //         ...gradesGiven2,
    //         ...gradesGiven3,
    //         ...gradesGiven4,
    //         ...gradesGiven5,
    //     ];
    //     saveEvaluations(allEvaluations, currentPair.id).then(resp => {
    //         if(resp.data){
    //             toast.success('Данные сохранены');
    //             setDisSaved(true);
    //             setRefCount({});
    //             setVotedStaff([]);
    //             socketAuth.emit('next-round');
    //         }
    //     })
    // }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    useEffect(() => {
        if(event.id > 0 && currentPair.id > 0){
            Promise.all([
                getVotedStaff(event.id, currentPair.id),
                getSupervisorFromEvent(event.id)
            ]).then(resp => {
                if(resp[0].data && resp[1].data){
                    
                    setVotedStaff(resp[0].data);
                    setSuperUser(resp[1].data);
                    getEvaluationsForSecr(currentPair.id, resp[1].data.id).then(resp => {
                        if(resp.data){
                            setDataSuper(resp.data);
                        }
                    })

                }
            }).catch(error => {
                console.debug("никто не проголосовал");
            })
        }
    }, [currentPair, event]);

    // useEffect(() => {
    //     getForSuperAndSetMark(refereeList, votedStaff);
    // }, [votedStaff]);

    // useEffect(() => {
    //     if(Object.keys(refCount).length >= 5 && currentPair.condition == 1){
    //         setDisSaved(false);
    //     }else if(Object.keys(refCount).length < 5 || currentPair.condition != 1){
    //         setDisSaved(true);
    //     }
    // }, [refCount]);

    useEffect(() => {
        function onSaveSuper(value) { //отображение данных супера по сокету
            // console.debug("super", value)
            const index = refereeList.findIndex((item) => item.id == value.user_id);
            if(index != -1){
                arrGrades[index](value.evaluations);
                refCount[index] = value.user_id;
                setRefCount({...refCount});
                // console.debug(refCount, refereeList);
            }
            getVotedStaff(event.id, currentPair.id).then(resp => {
                if(resp.data){
                    setVotedStaff(resp.data);
                }
            })
        }
        socketAuth.on('save-evaluations-supervisor', onSaveSuper);


        return () => {
            socketAuth.off('save-evaluations-supervisor', onSaveSuper);
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
                        <Tab label={<Grid><Typography>Судья 1</Typography></Grid>} {...a11yProps(0)} />
                        <Tab label={<Grid><Typography>Судья 2</Typography></Grid>} {...a11yProps(1)} />
                        <Tab label={<Grid><Typography>Судья 3</Typography></Grid>} {...a11yProps(2)} />
                        <Tab label={<Grid><Typography>Судья 4</Typography></Grid>} {...a11yProps(3)} />
                        <Tab label={<Grid><Typography>Судья 5</Typography></Grid>} {...a11yProps(4)} />
                    </Tabs>
                </Box>
                <Grid>
                    <CustomTabPanel secret value={value} index={0} gradesGiven={gradesGiven1} setGradesGiven={setGradesGiven1} />
                    <CustomTabPanel secret value={value} index={1} gradesGiven={gradesGiven2} setGradesGiven={setGradesGiven2} />
                    <CustomTabPanel secret value={value} index={2} gradesGiven={gradesGiven3} setGradesGiven={setGradesGiven3} />
                    <CustomTabPanel secret value={value} index={3} gradesGiven={gradesGiven4} setGradesGiven={setGradesGiven4} />
                    <CustomTabPanel secret value={value} index={4} gradesGiven={gradesGiven5} setGradesGiven={setGradesGiven5} />
                </Grid>
            </Grid>
            {/* {!secret && <Grid my={2} container display='flex' justifyContent='center'>
                <Button onClick={saveData} variant="outlined" color="success" disabled={disSaved}
                >
                    Сохранить
                </Button>
            </Grid>} */}
        </>

    )
}