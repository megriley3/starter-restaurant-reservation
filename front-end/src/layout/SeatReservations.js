import React, {useState, useEffect} from "react";
import {listTables, getReservation, addReservation, updateReservationStatus} from "../utils/api";
import {useParams, useHistory} from "react-router-dom";
import ErrorAlert from "./ErrorAlert";

function SeatReservations({seatReserved, setSeatReserved}){
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const[people, setPeople] = useState(null);
  const[seat, setSeat] = useState("");
  const reservation_id = useParams().reservation_id;
  const history = useHistory();

  useEffect(loadTables, [seat]);
  useEffect(loadPeople, []);
  
  function loadTables(){
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
    return () => abortController.abort();
  }

  function loadPeople(){
    const abortController = new AbortController();
    setError(null);
    getReservation(reservation_id, abortController.signal)
      .then((returnedPeople) => setPeople(returnedPeople.people))
      .catch(setError);
    return () => abortController.abort();
  }

  const options =  tables.map((table, index) => {
    if (!table.reservation_id) {
      return (
        <option key={table.table_name} value={table.table_name}>
          {table.table_name} - {table.capacity}
        </option>
      );
    }
  });

  const validCapacity = (table) => {
    if(people>table.capacity){
      setError({message: `table capacity is not large enough.`})
    }
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if(!seat){
      setError({message: `Select a table.`})
    } else{
      const table = tables.find((table) => table.table_name === seat);
      validCapacity(table);
      if(table.capacity>=people) {
        addReservation(reservation_id, table.table_id)
          .then(setSeatReserved({
            table_id: table.table_id,
            reservation_id: reservation_id
          }))
          .catch(setError);
        updateReservationStatus(reservation_id, "seated")
          .then(history.push("/"))
          .catch(setError);
      }
    }

  }
  
  const handleChange = ({target}) =>  setSeat(target.value);

  return(
    <>
    <h1>Seat Reservation</h1>
    <ErrorAlert error={error}/>
    <form name="seatReservation" onSubmit={handleSubmit}>
      <select name="table_id" id="table_id" onChange={handleChange}>
        <option value="">Select a Table</option>
        {options}
      </select>
      <br/>
      <button type="submit">Submit</button>
    </form>
    <button onClick={()=>history.goBack()}>Cancel</button>
    </>
  )
}


export default SeatReservations