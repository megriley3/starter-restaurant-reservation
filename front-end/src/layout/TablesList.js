import React, {useState} from "react";
import { deleteSeating, listTables } from "../utils/api";

function TablesList({tables, loadTables, setSeatReserved, seatReserved, seatDeleted, setSeatDeleted}){
  
    const handleClick = (event) => {
        event.preventDefault();
        const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
        if(result){
            setSeatReserved(null)
            deleteSeating(event.target.value)
                .then(setSeatDeleted(event.target.value))
                .then(loadTables)
            //console.log("deleted")
            //console.log("seatDeleted", seatDeleted)
        }
    }

    if(Array.isArray(tables)){
        const rows = tables.map((table, index) => {
            const {table_name, capacity, reservation_id, table_id} = table;
            if(reservation_id || seatReserved===table_id){
                return (
                    <tr key = {index}>
                        <td>{table_name}</td>
                        <td>{capacity}</td>
                        <td data-table-id-status={`${table_id}`}>Occupied</td>
                        <td><button type="button" data-table-id-finish={table.table_id} onClick={handleClick} value={table.table_id}>Finish</button></td>
                    </tr>
                )
            } else {
                return (
                    <tr key={index}>
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