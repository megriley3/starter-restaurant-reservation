import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {addReservation, listTables} from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function SeatReservations({tables, setTables}){
    const history = useHistory();
    const reservation_id = useParams().reservation_id;
    const [seat, setSeat] = useState("");
    const [error, setError] = useState(null);

    useEffect(loadTables, []);

    function loadTables(){
        const abortController = new AbortController();
        setError(null);
        listTables(abortController.signal)
          .then(setTables)
          .catch(setError);
        return () => abortController.abort();
      }
    
      const validCapacity = ()=>{
        const table = tables.find((table) => table.table_name===seat);
        const {capacity} = table;
        console.log(table)
      }

    const handleChange = ({target}) => setSeat(target.value);

    const handleSubmit = (event) => {
        event.preventDefault();
        validCapacity();
        setSeat("");
        const table = tables.find((table) => table.table_name === seat);
        addReservation(reservation_id, table.table_id)
            .then(history.push("/"))
            .catch(setError)
    }
    
    if(Array.isArray(tables)){
        const options = tables.map((table, index) => {
            if(!table.reservation_id){
                return <option key={table.table_name} value={table.table_name}>{table.table_name} - {table.capacity}</option>
            }
        })
        return (
            <>
            <h1>Seat a Reservation</h1>
            <ErrorAlert error={error}/>
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
            </>
        )
    }
    return (
        <>
        <h1>Seat a Reservation</h1>
        <ErrorAlert error = {error}/>
        <form>
            <label htmlFor="table_id">
                Table:
                <select name="table_id" id="table_id" onChange={handleChange} value={seat}>
                    <option value="">Select a Table</option>
                </select>
            </label>
        </form>
        </>
    )
}

export default SeatReservations;