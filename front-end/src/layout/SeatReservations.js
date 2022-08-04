import React, {useState, useEffect} from "react";
import {listTables, getReservation} from "../utils/api";
import {useParams} from "react-router-dom";
import ErrorAlert from "./ErrorAlert";

function SeatReservations({reservationDate}){
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const[people, setPeople] = useState(null);
  const[seat, setSeat] = useState("");
  const reservation_id = useParams().reservation_id;
  console.log(reservation_id, "resId")

  useEffect(loadTables, []);
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
    console.log(reservation_id, "resId")
    const abortController = new AbortController();
    setError(null);
    getReservation(reservation_id, abortController.signal)
      .then((returnedPeople) => setPeople(returnedPeople.people))
      .catch(setError);
    return () => abortController.abort();
  }

  const options =  tables.map((table, index) => {
    if (!table.reservation_id && table.capacity>=people) {
      return (
        <option key={table.table_name} value={table.table_name}>
          {table.table_name} - {table.capacity}
        </option>
      );
    }
  });
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("submitted");
    setError({message: `Select a table.`})
  }
  
  const handleChange = ({target}) => setSeat(target.value);

  console.log(people, "people")


  console.log(error, !error);

  return(
    <>
    <h1>Seat Reservation</h1>
    <ErrorAlert error={error}/>
    <form name="seatReservation" onSubmit={handleSubmit}>
      <select name="table_id" id="table_id" onChange={handleChange}>
        <option value="">Select a Table</option>
        {options}
      </select>
      <button type="submit">Submit</button>
    </form>
    <button onClick={()=>console.log("cancelled")}>Cancel</button>
    </>
  )
}


export default SeatReservations