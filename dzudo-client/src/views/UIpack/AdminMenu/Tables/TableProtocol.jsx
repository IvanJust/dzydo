import { Grid } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { getEvaluationAfterSupervisor, getRefereeFromEvent } from "../../../../core/Api/ApiData/methods/admin";
import { getEvaletionCriteria } from "../../../../core/Api/ApiData/methods/event";
import { getPairs } from "../../../../core/Api/ApiData/methods/pairs";

const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns = [
    { field: 'col1', headerName: 'Column 1' },
    { field: 'col2', headerName: 'Column 2' },
    { field: 'col3', headerName: 'Column 2' },
    { field: 'col4', headerName: 'Column 2' },
    { field: 'col5', headerName: 'Column 2' },
    { field: 'col6', headerName: 'Column 2' },
    { field: 'col7', headerName: 'Column 2' },
    { field: 'col8', headerName: 'Column 2' },
    { field: 'col9', headerName: 'Column 2' },
    { field: 'col10', headerName: 'Column 2' },
    { field: 'col11', headerName: 'Column 2' },
    { field: 'col12', headerName: 'Column 2' },
    { field: 'col14', headerName: 'Column 2' },
    { field: 'col15', headerName: 'Column 2' },
];


function CustomToolbar() {
    const csvOptions = {
        fileName: 'Протокол пар',
        delimiter: ';',
        utf8WithBom: true,
    }

    return (
        <GridToolbarContainer>
            <GridToolbarExport csvOptions={csvOptions} />
        </GridToolbarContainer>
    )
}

export default function TableProtocol() {
    const [data, setData] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    const [pairs, setPairs] = useState([]);
    const [referees, setReferees] = useState([]);

    const event_id = 1;

    useMemo(() => {
        const columns = [{ field: 'name', headerName: 'Техника' }];
        let isFillHeader = false;
        const rows = [];
        const resultRow = {id: 0, name: 'Итого'};

        criteria.forEach(itemCriteria => {
            const itemRow = {};
            itemRow['id'] = itemCriteria.id;
            itemRow['name'] = itemCriteria.evaluation_criteria;

            const currRow = data.filter(it => it.evaluation_criteria.id === itemCriteria.id)

            pairs.forEach((itemPair, indexPair) => {
                const currPair = currRow.filter(it => it.pair.id == itemPair.id);

                let maxV = 0;
                let minV = itemCriteria.init_value;
                let all = 0;

                const keyInResultRow = `${itemPair.id}_score`;

                referees.forEach((itemReferee, indexReferee) => {
                    const currReferee = currPair.filter(it => it.referee.id == itemReferee.id);
                    const debit = currReferee.reduce((sum, item) => sum + item.mark.score, 0);

                    const valueCriteria = itemCriteria.init_value - debit;
                    const keyInTable = `${itemPair.id}_${itemReferee.id}`;

                    itemRow[keyInTable] = valueCriteria;

                    maxV = Math.max(maxV, valueCriteria);
                    minV = Math.min(minV, valueCriteria);

                    if(!resultRow[keyInTable]) resultRow[keyInTable] = 0;
                    
                    resultRow[keyInTable] += valueCriteria;
                    all += valueCriteria;

                    if (!isFillHeader) {
                        columns.push(
                            { field: keyInTable, headerName: `${indexPair + 1}_${indexReferee + 1}` }
                        )
                    }
                });

                resultRow[keyInResultRow] = all - maxV - minV;

                if (!isFillHeader)
                    columns.push(
                        { field: keyInResultRow, headerName: `Итого` }
                    )
            });
            isFillHeader = true;
            rows.push(itemRow);
        });



        rows.push(resultRow);

        setRows(rows);
        setColumns(columns);
    }, [data, criteria, referees, pairs])

    useEffect(() => {
        getEvaluationAfterSupervisor(event_id).then(resp => {
            setData(resp.data || [])
            console.debug(resp.data);
        });

        getEvaletionCriteria().then(resp => {
            setCriteria(resp.data || []);
        });

        getPairs(event_id, 0).then(resp => {
            setPairs(resp.data || []);
        });

        getRefereeFromEvent(event_id).then(resp => {
            setReferees(resp.data || []);
        });

    }, [])

    return (
        <Grid>
            <DataGrid rows={rows} columns={columns} disableColumnSorting disableColumnFilter hideFooterPagination slots={{ toolbar: CustomToolbar }} density="compact" />
        </Grid>
    )
}