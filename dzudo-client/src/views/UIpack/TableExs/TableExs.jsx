import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MenuSecretar from "../MenuSecretar/MenuSecretar";
import MenuReferer from "../MenuRefer/MenuReferer";
import MenuSupervisor from "../MenuSupervisor/MenuSupervisor";



function TableExs() {


    const role_id = useSelector(state => state.user.role.id);

    return (
        <>
            {role_id == 2 && <MenuSecretar />}
            {role_id == 3 && <MenuSupervisor/>}  
            {role_id == 4 && <MenuReferer/>}  
        </>
    )

}

export default TableExs;