import { Chip, ClickAwayListener, Grid, IconButton, Tooltip } from "@mui/material";
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import React, { useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import InfoIcon from '@mui/icons-material/Info';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SportsIcon from '@mui/icons-material/Sports';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import { getRefereeFromEvent, getSecretaryFromEvent, getSupervisorFromEvent } from "../../../core/Api/ApiData/methods/admin";
import { ShortName } from "../../../features/functions";

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

function RowTip({item}){
    let avatar;
    if(item.idRole == 2){
        avatar = <ContactEmergencyIcon fontSize="large" titleAccess="Секретарь" />;
    }else if(item.idRole == 3){
        avatar = <SupervisorAccountIcon fontSize="large" titleAccess="Супервайзер" />;
    }else if(item.idRole == 4){
        avatar = <SportsIcon fontSize="large" titleAccess="Судья" />;
    }else{
        avatar = '';
    }
    return(
        <Chip
            sx={{
                display:'flex',
                justifyContent: 'space-between',
                height: 'auto',
                '& .MuiChip-label': {
                    display: 'block',
                    whiteSpace: 'normal',
                },
                my: 0.5
            }} 
            avatar={avatar} 
            label={ShortName(item)} 
            variant="contained" 
        />
    )
}


export default function InfoMenu({eventId}){
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
  
    const handleTooltipClose = () => {
        setOpen(false);
        setData([]);
        setIsLoad(false);
    };
  
    const handleTooltipOpen = () => {
        if(!open && data.length == 0){
            Promise.all([
                getSecretaryFromEvent(eventId),
                getSupervisorFromEvent(eventId),
                getRefereeFromEvent(eventId),
            ]).then(responce => {
                if(responce[0].data && responce[1].data && responce[2].data){
                    setData(data.concat(responce[0].data.map(item=>{return {...item, idRole: 2}})).concat(responce[1].data.map(item=>{return {...item, idRole: 3}})).concat(responce[2].data.map(item=>{return {...item, idRole: 4}})));
                    setIsLoad(true);
                }
            })
        }
        setOpen(true);
    };

    return (
        <Grid item>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <LightTooltip
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={data.length > 0 && <Grid display={'flex'} flexDirection={'column'} justifyContent={'flex-start'}>{data.map(item => <RowTip item={item} />)}</Grid> || open && !isLoad &&<Grid><CircularProgress /></Grid> || open && (<Grid>Персонал не назначен</Grid>)}
                placement="right"
              >
                <IconButton onClick={handleTooltipOpen} size="medium" children={<InfoIcon color="info" fontSize="medium" />} />
              </LightTooltip>
            </div>
          </ClickAwayListener>
        </Grid>
    )
}