import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ReservationsList from "../layout/ReservationsList";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import TablesList from "../layout/TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ reservationDate, setReservationDate, tables, setTables, updateTables }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [reservationDate]);
  useEffect(loadTables, [tables]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations( {date: reservationDate} , abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function loadTables(){
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(updateTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  function handleClickPrevious(){
    setReservationDate(previous(reservationDate));
    history.push(`/dashboard?date=${reservationDate}`)
  }
  
  function handleClickToday(){
    setReservationDate(today())
    history.push(`/dashboard?date=${reservationDate}`)
  }

  function handleClickNext(){
    setReservationDate(next(reservationDate));
    history.push(`/dashboard?date=${reservationDate}`)
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {reservationDate}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <h3>Reservations</h3>
      <ReservationsList reservations={reservations}/>
      <ErrorAlert error={tablesError}/>
      <h3>Tables</h3>
      <TablesList tables={tables}/>
      {/*{JSON.stringify(reservations)}
  {JSON.stringify(tables)}*/}
      <div>
        <button onClick={handleClickPrevious}>Previous</button>
        <button onClick={handleClickToday}>Today</button>
        <button onClick={handleClickNext}>Next</button>
      </div>
    </main>
  );
}

export default Dashboard;
