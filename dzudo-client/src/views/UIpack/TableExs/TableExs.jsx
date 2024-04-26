import React from "react";
import { useSelector } from "react-redux";
import MenuSecretar from "../MenuSecretar/MenuSecretar";
import MenuReferer from "../MenuRefer/MenuReferer";
import MenuSupervisor from "../MenuSupervisor/MenuSupervisor";
import { Breadcrumbs, Container } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Bread from "../../UIpack v2/Bread/Bread";



function TableExs({bread}) {

    bread = Bread(bread);

    const role_id = useSelector(state => state.user.role.id);

    return (
        <Container>
            <Breadcrumbs
                sx={{my: 1}}
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="Административное меню"
            >
                {bread}
            </Breadcrumbs>
            {role_id == 2 && <MenuSecretar />}
            {role_id == 3 && <MenuSupervisor/>}  
            {role_id == 4 && <MenuReferer/>}  
        </Container>
    )

}

export default TableExs;