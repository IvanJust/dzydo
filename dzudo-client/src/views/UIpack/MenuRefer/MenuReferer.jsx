import React, { useContext, useEffect, useState } from "react";
import CustomTabPanel from "../PanelsMark/OnePanel";
import { SocketContext } from "../../../context/SocketProvider";
import ListPair from "../ListPair/ListPair";
import { getVotedStaff, saveEvaluations } from "../../../core/Api/ApiData/methods/event";
import { Button, Container, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getForSuper, getPairs } from "../../../core/Api/ApiData/methods/pairs";
import { setCurrentPair } from "../../../store/slices/userSlice";
import toast from "react-hot-toast";

export default function MenuReferer() {
    const dispatch = useDispatch();
    const { socketAuth, isConnected } = useContext(SocketContext);
    const currentPair = useSelector(state => state.user.currentPair);
    const user = useSelector(state => state.user.userInfo);
    const event = useSelector(state => state.user.eventInfo);
    const [data, setData] = useState([])
    const [pairs, setPairs] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [gradesGiven, setGradesGiven] = useState([]);

    // console.debug("connected status", isConnected);

    useEffect(() => {
        
        if(event.id > 0){
            getPairs(event.id).then(resp => {
                setPairs(resp.data);
                resp.data.forEach(it => {
                    if(it.condition == 1) dispatch(setCurrentPair(it));
                })
            })
        }
        return () => {
            setData([]);
            setPairs([]);
        }
    }, [event, socketAuth]);

    useEffect(() => {
        if(event.id>0 && currentPair.id>0){
            getForSuper(currentPair.id, user.id).then(resp => {
                if(resp.data){
                    setGradesGiven(resp.data.map(element => {return {
                        pair_id: currentPair.id,
                        evaluation_criteria_id: element.evaluation_criteria.id,
                        mark_id: element.mark.id,
                        score: element.mark.score,      
                    }}))
                }
            })
            getVotedStaff(event.id, currentPair.id).then(resp => {
                if(resp.data){
                    if(resp.data.findIndex(item => item.user_id == user.id) != -1){
                        setIsSaved(true);
                    }else{
                        setIsSaved(false);
                    }
                }
            })
        }
    }, [event, currentPair]);
    
    useEffect(() => {
        function onChangeRound(value) {
            if(value.condition == 1){
                dispatch(setCurrentPair(value));
            }else{
                dispatch(setCurrentPair({}));
            }
            getPairs(event.id).then(resp => {
                if(resp.data){
                    setPairs(resp.data)
                }
            });
            setGradesGiven([]);
            setIsSaved(false);
        }

        socketAuth.on('change-round', onChangeRound);


        return () => {
            socketAuth.off('change-round', onChangeRound);
        }
    }, [socketAuth, pairs])
 

    const saveData = () => {
        if(!isSaved){
            saveEvaluations(gradesGiven, currentPair.id).then(resp => {
                if(resp.data.Successfully){
                    setIsSaved(true);
                }else{
                    toast.error('Ошибка сохранения: '+resp.data.error);
                }
            })
        }
    }
    // console.debug("pair ", currentPair, event);

    return (
        <Container justifyContent='space-evenly'>
            <Grid item>
                <ListPair pairs={pairs} setPairs={setPairs} />
            </Grid>
            <Grid item>
                {/* <Box> */}
                    <CustomTabPanel value={0} index={0} gradesGiven={gradesGiven} setGradesGiven={setGradesGiven} />
                    <Grid my={1}>
                        <Button variant="outlined" color="success" onClick={saveData} disabled={currentPair?.condition != 1 || isSaved}>Сохранить</Button>
                    </Grid>
                {/* </Box> */}
            </Grid>
            
        </Container>
    )
}