import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getEvaletionCriteria, getMarks } from "../../../core/Api/ApiData/methods/event";


function RowTab({marks, name, id, ...props}){
  const length = marks.length
  return(
    <Box my={1}  sx={{ flexGrow: 1 }}>
      <Grid container  rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6} md={1}>
          {id}
        </Grid>
        <Grid item xs={6} md={4}>
          {name}
        </Grid>
        {marks.map((mark) => (
          <Grid item xs={6} md={1}>
            {props.isName && mark.name}
            {props.isScore && mark.score}
          </Grid>
        ))}
        <Grid item xs={6} md={1}>
          {props.isName && 'Score'}
          {props.isScore && '10'}
        </Grid>
      </Grid>
    </Box>
  )
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    const [evaletionCriteries, setEvaletionCriteries] = useState([]);
    const [marks, setMarks] =useState([]);

    console.debug('marks', marks);
    console.debug('criteries', evaletionCriteries);
    useEffect(() => {
      getMarks().then((resp) => {
        setMarks(resp.data);
      });
      getEvaletionCriteria().then((resp) => {
        setEvaletionCriteries(resp.data);
      });

    }, []);

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
            <RowTab name='Предварительные встречи' isName={true} marks={marks} id='№' />
            {evaletionCriteries.map((criteria) => (
              <RowTab name={criteria.evaluation_criteria} isScore={true} marks={marks} id={criteria.id} />
            ))}
          </Grid>
        )}
      </div>
    );
  }

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


function TableExs(){
    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    return(
        <Grid sx={{width: '100%'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display:'flex', justifyContent: 'center' }}>
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
            </Box>
            <CustomTabPanel value={value} index={0} />
            <CustomTabPanel value={value} index={1} />
            <CustomTabPanel value={value} index={2} />
            <CustomTabPanel value={value} index={3} />
            <CustomTabPanel value={value} index={4} />
        </Grid>
    )

}

export default TableExs;