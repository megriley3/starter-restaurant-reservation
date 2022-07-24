import React, {useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {addReservation} from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function SeatReservations({tables, setTables}){
    const history = useHistory();
    const reservation_id = useParams().reservation_id;
    const [seat, setSeat] = useState("");
    const [error, setError] = useState(null)

    const handleChange = ({target}) => setSeat(target.value);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSeat("");
        const table = tables.find((table) => table.table_name === seat)
        addReservation(reservation_id, table.table_id)
            .then(history.pushState("/"))
            .catch(setError)
    }
    
    if(Array.isArray(tables)){
        const options = tables.map((table, index) => {
            <option value={table.table_name}>{table.table_name} - {table.capacity}</option>
        })
        return (
            <form onSubmit={handleSubmit}>
                <label htmlFor="table_id">
                    Table:
                    <select name="table_id" id="table_id" onChange={handleChange} value={seat}>
                        <option value="">Select a Table</option>
                        {options}
                    </select>
                </label>
                <br/>
                <button type="submit">Submit</button>
                <button onClick={()=>history.goBack()}>Cancel</button>
            </form>
        )
    }
    return (
        <form>
            <ErrorAlert error = {error}/>
            <label htmlFor="table_id">
                Table:
                <select name="table_id" id="table_id" onChange={handleChange} value={seat}>
                    <option value="">Select a Table</option>
                </select>
            </label>
        </form>
    )
}

export default SeatReservations;