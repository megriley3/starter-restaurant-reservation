import React from "react";

function TablesList({tables}){
    if(Array.isArray(tables)){
        const rows = tables.map(({table_name, capacity, reservation_id, table_id}, index) => {
            if(reservation_id){
                return (
                    <tr key = {index}>
                        <td>{table_name}</td>
                        <td>{capacity}</td>
                        <td data-table-id-status={`${table_id}`}>Occupied</td>
                    </tr>
                )
            } else{
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
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        )
    }
    return null;


}

export default TablesList