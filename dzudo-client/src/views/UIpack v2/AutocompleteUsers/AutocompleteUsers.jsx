import React, { useState } from "react";
import StandartAutocomplete from "../StandartAutocomlete/StandartAutocomplete";
import { getUsers } from "../../../core/Api/ApiData/methods/admin";
import { Autocomplete, TextField } from "@mui/material";
import { ShortName } from "../../../features/functions";

export default function AutocompleteUsers({onChange, value, labelTextField, ...props}){
    const [users, setUsers] = useState([]);

    
    const updateUser = (input)=>{
        getUsers(input).then((resp) => {
            setUsers(resp.data.map(item => {return {'label': ShortName(item), 'id': item.user_id}}));
        });
    }

    return(
        <Autocomplete
                fullWidth
                noOptionsText='Пусто'
                disablePortal
                getOptionLabel={(option) => option.label || ""}
                options={users}
                value={value}
                onChange={onChange}
                renderInput={(params) => <TextField {...params} label={labelTextField} />}
                onInputChange={(event, newInputValue) => {
                    updateUser(newInputValue);
                }}
                filterOptions={(x) => x}
                isOptionEqualToValue={(option, value) => 
                    option.id == value.id || value === undefined
                }
                {...props}
            />
    )
}