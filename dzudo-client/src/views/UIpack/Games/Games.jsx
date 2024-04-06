import React from "react";
import { useParams } from "react-router-dom";


export default function Games(){
    let { id } = useParams();
    console.debug(id);
    return(
        <>
        </>
    )
}