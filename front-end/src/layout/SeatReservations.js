import React, {useState, useEffect} from "react";
import {listTables, listReservations} from "../utils/api";
import {useParams} from "react-router-dom";
import ErrorAlert from "./ErrorAlert";

function SeatReservations({reservationDate}){
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const[seat, setSeat] = useState("");
  const reservation_id = useParams().reservation_id;
  console.log(reservation_id, reservations)

  useEffect(loadTables, []);
  //useEffect(loadReservations, []);
  
  function loadTables(){
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
    return () => abortController.abort();
  }

  function loadReservations() {
    const abortController = new AbortController();
    setError(null);
    listReservations( {date: reservationDate} , abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  const reservation = reservations.find((reservation) => reservation.reservation_id === Number(reservation_id));
  console.log(reservation, "reservations")

  /*const options =  tables.map((table, index) => {
    if (!table.reservation_id && table.capacity>=reservation.people) {
      return (
        <option key={table.table_name} value={table.table_name}>
          {table.table_name} - {table.capacity}
        </option>
      );
    }
  });*/
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("submitted");
    setError({message: `Select a table.`})
  }
  
  const handleChange = ({target}) => setSeat(target.value);


  console.log(error, !error);

  return(
    <>
    <h1>Seat Reservation</h1>
    <ErrorAlert error={error}/>
    {JSON.stringify(tables)}{JSON.stringify(reservations)}
    <form name="seatReservation" onSubmit={handleSubmit}>
      <select name="table_id" id="table_id" onChange={handleChange}>
        <option value="">Select a Table</option>
        
      </select>
      <button type="submit">Submit</button>
    </form>
    <button onClick={()=>console.log("cancelled")}>Cancel</button>
    </>
  )
}


export default SeatReservations