import { Grid } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { getEvaluationAfterSupervisor, getRefereeFromEvent } from "../../../../core/Api/ApiData/methods/admin";
import { getEvaletionCriteria } from "../../../../core/Api/ApiData/methods/event";
import { getPairs } from "../../../../core/Api/ApiData/methods/pairs";
import SelectEvent from "../../../UIpack v2/SelectEvent/SelectEvent";

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

    const [eventId, setEventId] = useState(0);

    useMemo(() => {
        const columns = [{ field: 'name', headerName: 'Техника' }];
        let isFillHeader = false;
        const isHasForgotten = {};
        const rows = [];
        const resultRow = { id: 0, name: 'Итого' };

        criteria.forEach(itemCriteria => {
            const itemRow = {};
            itemRow['id'] = itemCriteria.id;
            itemRow['name'] = itemCriteria.evaluation_criteria;

            const currRow = data.filter(it => it.evaluation_criteria.id === itemCriteria.id)

            pairs.forEach((itemPair, indexPair) => {
                const currPair = currRow.filter(it => it.pair.id == itemPair.id);

                const keyInResultRow = `${itemPair.id}_score`;

                referees.forEach((itemReferee, indexReferee) => {
                    const currReferee = currPair.filter(it => it.referee.id == itemReferee.id);
                    const debit = currReferee.reduce((sum, item) => sum + item.mark.score, 0);

                    const isChange = currReferee.reduce((isChange, item) => isChange || item.is_change, false);

                    const valueCriteria = itemCriteria.init_value - debit;
                    const keyInTable = `${itemPair.id}_${itemReferee.id}`;

                    itemRow[keyInTable] = valueCriteria + (isChange ? ' (изм.)' : '');



                    if (!resultRow[keyInTable]) resultRow[keyInTable] = 0;

                    resultRow[keyInTable] += valueCriteria;


                    //если есть Forgotten
                    if (currReferee.findIndex(it => it.mark.id == 4) != -1) {
                        isHasForgotten[keyInTable] = true;
                    }

                    if (!isFillHeader) {
                        columns.push(
                            { field: keyInTable, headerName: `${indexPair + 1}_${indexReferee + 1}` }
                        )
                    }
                });

                if (!isFillHeader)
                    columns.push(
                        { field: keyInResultRow, headerName: `Итого` }
                    )
            });

            isFillHeader = true;
            rows.push(itemRow);
        });


        pairs.forEach(itemPair => {
            const keyInResultRow = `${itemPair.id}_score`;
            let allScore = 0;
            let maxV = -1;
            let minV = -1;

            referees.forEach(itemReferee => {
                const keyInTable = `${itemPair.id}_${itemReferee.id}`;

                if (isHasForgotten[keyInTable]) {
                    resultRow[keyInTable] = resultRow[keyInTable] / 2;
                    //delete isHasForgotten[keyInTable];
                }

                if (maxV === -1) maxV = resultRow[keyInTable];
                if (minV === -1) minV = resultRow[keyInTable];

                maxV = Math.max(maxV, resultRow[keyInTable]);
                minV = Math.min(minV, resultRow[keyInTable]);

                allScore += resultRow[keyInTable];
            });

            resultRow[keyInResultRow] = allScore - minV - maxV;
        });

        rows.push(resultRow);

        setRows(rows);
        setColumns(columns);
    }, [data, criteria, referees, pairs])

    useEffect(() => {
            getEvaletionCriteria().then(resp => {
                setCriteria(resp.data || []);
            });

        if(eventId > 0){
            getEvaluationAfterSupervisor(eventId).then(resp => {
                setData(resp.data || [])
                // console.debug(resp.data);
            });

            getPairs(eventId, 0).then(resp => {
                setPairs(resp.data || []);
            });

            getRefereeFromEvent(eventId).then(resp => {
                setReferees(resp.data || []);
            });
        }
        return () => {
            setData([])
            setReferees([]);
            setPairs([]);
            setCriteria([]);
        }
    }, [eventId])

    return (
        <Grid>
            <Grid item my={1}><SelectEvent value={eventId} onChange={(event) => setEventId(event.target.value)} /></Grid>
            <DataGrid rows={rows} columns={columns} disableColumnSorting disableColumnFilter hideFooterPagination slots={{ toolbar: CustomToolbar }} noResultsOverlay='Нет данных' density="compact" />
        </Grid>
    )
}