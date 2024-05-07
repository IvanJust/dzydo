import React, { useContext, useEffect, useState } from "react";
import CustomTabPanel from "../PanelsMark/OnePanel";
import { SocketContext } from "../../../context/SocketProvider";
import ListPair from "../ListPair/ListPair";
import { saveEvaluations } from "../../../core/Api/ApiData/methods/event";
import { Button, Container, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getPairs } from "../../../core/Api/ApiData/methods/pairs";
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

    console.debug("connected status", isConnected);

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
    }, [event.id, socketAuth]);

    useEffect(() => {
        setIsSaved(false);
    }, [currentPair.id, socketAuth]);
 
    const [gradesGiven, setGradesGiven] = useState([]);

    const saveData = () => {
        if(!isSaved){
            saveEvaluations(gradesGiven, currentPair.id).then(resp => {
                console.debug(resp);
                if(resp.data.Successfully){
                    setIsSaved(true);
                }else{
                    toast.error('Ошибка сохранения: '+resp.data.error);
                }
            })
        }
    }
    console.debug("pair ", currentPair, event);

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