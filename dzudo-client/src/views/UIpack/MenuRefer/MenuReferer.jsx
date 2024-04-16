import React, { useContext, useState } from "react";
import CustomTabPanel from "../PanelsMark/OnePanel";
import { SocketContext } from "../../../context/SocketProvider";
import ListPair from "../ListPair/ListPair";
import { saveEvaluations } from "../../../core/Api/ApiData/methods/event";
import { Box, Button, Grid } from "@mui/material";
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
        <Grid container>
            <Grid container sx={6}>
                <ListPair />
            </Grid>
            <Grid container sx={6}>
                <Box>
                    <CustomTabPanel value={0} index={0} gradesGiven={gradesGiven} setGradesGiven={setGradesGiven} />
                    <Button variant="outline" onClick={saveData} disabled={currentPair?.condition != 1}>Save</Button>
                </Box>
            </Grid>
            
        </Grid>
    )
}