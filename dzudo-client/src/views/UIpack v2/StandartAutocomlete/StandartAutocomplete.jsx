import React from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function StandartAutocomplete({ options, label, multiple, value, ...props }) {
    const selectedValues = React.useMemo(
        () => {
            if(multiple)
                return options.filter((v) =>
                    (value || []).includes(v.id)
                )
            else return options.find(v => v.id == value)
        },
        [options, value],
    ) || null;

    return (
        <Autocomplete
            {...props}
            value={selectedValues}
            multiple={multiple}
            disablePortal
            getOptionLabel={(option) => option.label}
            options={options}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    )
}