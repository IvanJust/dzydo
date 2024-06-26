import { Box, Grid, Tab, Tabs, Breadcrumbs, Container, Alert } from "@mui/material"
import React, { useState } from "react"
import RegistrationUser from "./Registration/RegistrationUser";
import toast from "react-hot-toast";
import RegistrationEvent from "./Registration/RegistrationEvent";
import { setEvent } from "../../../core/Api/ApiData/methods/event";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TableUsers from "./Tables/TableUser";
import TableEvents from "./Tables/TableEvent";
import { Link } from "react-router-dom";
import Bread from "../../UIpack v2/Bread/Bread";
import { useSelector } from "react-redux";
import TableProtocol from "./Tables/TableProtocol";
import TablePair from "./Tables/TablePair";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Grid my={2}>
                    {children}
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

export default function AdminMenu({bread}){
    const [value, setValue] = React.useState(0);
    const [dataLoginEvent, setDataLoginEvent] = useState({});
    const isAdmin = useSelector((state) => state.user.isAdmin);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    bread = Bread(bread);



    function registrationEvent() {
        setEvent(dataLoginEvent.name, dataLoginEvent.place, dataLoginEvent.date_begin, dataLoginEvent.date_end)
            .then((resp) => {
                if(resp.data){
                    toast.success("Вы успешно организовали соревнование!");
                    document.getElementById("registrationEvent").reset();
                    setDataLoginEvent({});
                }else{
                    toast.error("Произошла ошибка организации");
                }
            });
    }
    


    const handleOnChangeLoginFormEvent = (event) => {
        dataLoginEvent[event.target.name] = event.target.value;
        setDataLoginEvent(dataLoginEvent);
    }

    return(
        <Container mt={2}>
                <Breadcrumbs
                    sx={{my: 1}}
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="Административное меню"
                >
                    {bread}
                </Breadcrumbs>
                <Grid sx={{ width: '100%' }} justifyContent={'center'}>
                    {isAdmin && <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', display:'flex', justifyContent: 'center' }}>
                            <Tabs 
                                value={value} 
                                onChange={handleChange}
                                textColor="secondary"
                                indicatorColor="secondary"
                                aria-label="secondary tabs example"
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                <Tab label="Регистрация пользователя" {...a11yProps(0)} />
                                <Tab label="Создать мероприятие" {...a11yProps(1)} />
                                <Tab label="Список пользователей" {...a11yProps(2)} />
                                <Tab label="Список мероприятий" {...a11yProps(3)} />
                                <Tab label="Список пар" {...a11yProps(4)} />
                                <Tab label="Протоколы" {...a11yProps(5)} />
                            </Tabs>
                        </Box>
                        <Grid>
                            <CustomTabPanel value={value} index={0}>
                                <RegistrationUser />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <RegistrationEvent onChange={handleOnChangeLoginFormEvent} onClick={registrationEvent} />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>
                                <TableUsers />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={3}>
                                <TableEvents />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={4}>
                                <TablePair />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={5}>
                                <TableProtocol />
                            </CustomTabPanel>
                        </Grid>
                    </>}
                    {!isAdmin && <Alert sx={{my: 2}} color="error">У вас нет прав для модуля администрирования</Alert>}
                </Grid>
        </Container>
    )
}