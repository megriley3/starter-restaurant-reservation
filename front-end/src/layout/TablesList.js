import React, {useState} from "react";
import { deleteSeating, updateReservationStatus } from "../utils/api";

function TablesList({tables, loadTables, setSeatReserved, seatReserved, setTablesError, seatDeleted, setSeatDeleted}){

    const handleClick = (event) => {
        event.preventDefault();
        const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
        if(result){
            const table_id = event.target.value;
            const reservedTable = tables.find((table) => Number(table_id)===table.table_id);
            let {reservation_id} = reservedTable;
            if(!reservation_id) reservation_id = seatReserved.reservation_id;
            const abortController = new AbortController();
            deleteSeating(table_id, abortController.signal)
                .then(setSeatReserved({table_id: null, reservation_id: null, finishedRes: reservation_id}))
                .then(setSeatDeleted(table_id))
                .catch(setTablesError);
           updateReservationStatus(reservation_id, "finished", abortController.signal)
                .then(loadTables)
                .catch(setTablesError)
            return ()=>abortController.abort();
        }
    }

    if(Array.isArray(tables)){
        const rows = tables.map((table, index) => {
            const {table_name, capacity, reservation_id, table_id} = table;
            if((reservation_id  && !(seatReserved.finishedRes===reservation_id)) || Number(seatReserved.table_id)===table_id){
                return (
                    <tr key = {table_id}>
                        <td>{table_name}</td>
                        <td>{capacity}</td>
                        <td data-table-id-status={`${table_id}`}>Occupied</td>
                        <td><button type="button" data-table-id-finish={table.table_id} onClick={handleClick} value={ table.table_id}>Finish</button></td>
                    </tr>
                )
            } else {
                return (
                    <tr key={table_id}>
                        <td>{table_name}</td>
                        <td>{capacity}</td>
                        <td data-table-id-status={`${table_id}`}>Free</td>
                    </tr>
                )
            }
            })
        return (
            <table>
                <thead>
                    <tr>
                        <th>Table Name</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        )
    }
    return null;


}

export default TablesList