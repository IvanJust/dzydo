import React, { useContext, useState } from "react";
import CustomTabPanel from "../PanelsMark/OnePanel";
import { SocketContext } from "../../../context/SocketProvider";
import ListPair from "../ListPair/ListPair";
import { saveEvaluations } from "../../../core/Api/ApiData/methods/event";
import { Button, Container, Grid } from "@mui/material";
import { useSelector } from "react-redux";

export default function MenuReferer() {
    const { socketAuth, isConnected } = useContext(SocketContext);
    const currentPair = useSelector(state => state.user.currentPair);

    const [gradesGiven, setGradesGiven] = useState([]);

    const saveData = () => {
        saveEvaluations(gradesGiven, currentPair.id).then(resp => {
            console.debug(resp);
        })
    }
    console.debug("pair ", currentPair);

    return (
        <Container justifyContent='space-evenly'>
            <Grid item>
                <ListPair />
            </Grid>
            <Grid item>
                {/* <Box> */}
                    <CustomTabPanel value={0} index={0} gradesGiven={gradesGiven} setGradesGiven={setGradesGiven} />
                    <Grid my={1}>
                        <Button variant="outlined" color="success" onClick={saveData} disabled={currentPair?.condition != 1}>Сохранить</Button>
                    </Grid>
                {/* </Box> */}
            </Grid>
            
        </Container>
    )
}