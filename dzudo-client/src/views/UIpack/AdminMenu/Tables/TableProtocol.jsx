import { Button, Grid } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { getEvaluationAfterSupervisor, getRefereeFromEvent } from "../../../../core/Api/ApiData/methods/admin";
import { getEvaletionCriteria } from "../../../../core/Api/ApiData/methods/event";
import { getPairs } from "../../../../core/Api/ApiData/methods/pairs";
import SelectEvent from "../../../UIpack v2/SelectEvent/SelectEvent";
import * as ExcelJS from "exceljs"
import { getDateFromSQL, getFormatDateFromSQL } from "../../../../features/functions";


export default function TableProtocol() {
    const [data, setData] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    const [pairs, setPairs] = useState([]);
    const [referees, setReferees] = useState([]);

    const [eventFull, setEventFull] = useState({});

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

    const BtnExport = useCallback(() => {
        const exportf = async () => {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Протоколы');

            worksheet.columns = columns.map((it, index)=>{
                return {
                    header: it.headerName,
                    key: it.field,
                    width: index == 0 ? 25 : 10
                }
            });

            worksheet.duplicateRow(1, 3, true);

            worksheet.getRow(3).values = [];

            worksheet.getRow(1).values = [eventFull.name, , , , , eventFull.place];
            worksheet.getRow(2).values = ['с', getFormatDateFromSQL(eventFull.date_begin), 'по', getFormatDateFromSQL(eventFull.date_end)];

            worksheet.mergeCells(1, 1, 1, 5);
            worksheet.mergeCells(1, 6, 1, 10);



            rows.forEach(it => {
                worksheet.addRow(it);
            })

            const bytes = await workbook.xlsx.writeBuffer();
            const data = new Blob([bytes])

            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "Протокол пар.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
        }

        return (
            <div onClick={exportf}>
                <Button variant="outlined">Экспорт в Excel</Button>
            </div>
        )
    }, [eventFull, rows, columns])

    useEffect(() => {
        getEvaletionCriteria().then(resp => {
            setCriteria(resp.data || []);
        });

        if (eventFull.id > 0) {
            getEvaluationAfterSupervisor(eventFull.id).then(resp => {
                setData(resp.data || [])
            });

            getPairs(eventFull.id, 0).then(resp => {
                setPairs(resp.data.filter(item => item.condition != 3 && item.condition != 0) || []);
            });

            getRefereeFromEvent(eventFull.id).then(resp => {
                setReferees(resp.data || []);
            });
        }
        return () => {
            setData([])
            setReferees([]);
            setPairs([]);
            setCriteria([]);
        }
    }, [eventFull.id])


    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <BtnExport />
            </GridToolbarContainer>
        )
    }

    return (
        <Grid>
            <Grid item my={1}><SelectEvent value={eventFull.id} onChange={(event) => setEventFull(event)} isFull={true} /></Grid>
            <DataGrid rows={rows} columns={columns} disableColumnSorting disableColumnFilter hideFooterPagination slots={{ toolbar: CustomToolbar }} noResultsOverlay='Нет данных' density="compact" />
        </Grid>
    )
}