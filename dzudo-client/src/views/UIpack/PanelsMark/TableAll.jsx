import React, { useEffect, useState } from "react";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";

import CustomTabPanel from "./OnePanel";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TableAll() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
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