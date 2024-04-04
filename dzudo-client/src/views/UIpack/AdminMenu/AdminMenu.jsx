import { Box, Grid, Tab, Tabs, Typography } from "@mui/material"
import React, { useState } from "react"
import RegistrationUser from "./Registration/RegistrationUser";
import { setUser } from "../../../core/Api/ApiData/methods/portfolio";
import toast from "react-hot-toast";
import RegistrationEvent from "./Registration/RegistrationEvent";
import { setEvent } from "../../../core/Api/ApiData/methods/event";

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
            <Box sx={{ p: 3 }}>
                {children}
            </Box>
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


export default function AdminMenu(){
    const [value, setValue] = React.useState(0);
    const [dataLoginUser, setDataLoginUser] = useState({});
    const [dataLoginEvent, setDataLoginEvent] = useState({});
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    function registrationUser() {
        setUser(dataLoginUser.login, dataLoginUser.password, dataLoginUser.firstname, dataLoginUser.lastname, dataLoginUser.patronymic)
            .then((resp) => {
                if(resp.data){
                    toast.success("Вы успешно зарегистрировали пользователя!");
                    setDataLoginUser({});
                }else{
                    toast.error("Произошла ошибка регистрации");
                }
                
            });
    }

    function registrationEvent() {
        setEvent(dataLoginEvent.name, dataLoginEvent.place, dataLoginEvent.date_begin, dataLoginEvent.date_end)
            .then((resp) => {
                if(resp.data){
                    toast.success("Вы успешно организовали соревнование!");
                    setDataLoginEvent({});
                }else{
                    toast.error("Произошла ошибка организации");
                }
            });
    }
    
    const handleOnChangeLoginFormUser = (event) => {
        console.debug(event.target.name);
        dataLoginUser[event.target.name] = event.target.value;
        setDataLoginUser(dataLoginUser);
    }

    const handleOnChangeLoginFormEvent = (event) => {
        dataLoginEvent[event.target.name] = event.target.value;
        setDataLoginEvent(dataLoginEvent);
    }

    return(
        <Grid mt={2}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display:'flex', justifyContent: 'center' }}>
                <Tabs 
                    value={value} 
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab label="Регистрация пользователя" {...a11yProps(0)} />
                    <Tab label="Создать мероприятие" {...a11yProps(1)} />
                    <Tab label="Список пользователей" {...a11yProps(2)} />
                    <Tab label="Список мероприятий" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <RegistrationUser onChange={handleOnChangeLoginFormUser} onClick={registrationUser} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <RegistrationEvent onChange={handleOnChangeLoginFormEvent} onClick={registrationEvent} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                Item Two
            </CustomTabPanel>
        </Grid>
    )
}