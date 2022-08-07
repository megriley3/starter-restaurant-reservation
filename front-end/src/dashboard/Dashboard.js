import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ReservationsList from "./ReservationsList";
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

function Dashboard({ reservationDate, setReservationDate, seatReserved, setSeatReserved }) {
  const history = useHistory(); 

  const [reservations, setReservations] = useState(null);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);
  const [seatDeleted, setSeatDeleted] = useState(null);
  const [cancelled, setCancelled] = useState("");
  
  useEffect(loadDashboard, [reservationDate, seatReserved, cancelled]);
  useEffect(loadTables, [seatReserved, seatDeleted]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: reservationDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  function handleClickPrevious() {
    const newDate = previous(reservationDate);
    setReservationDate(newDate);
    history.push(`/dashboard?date=${newDate}`);
  }

  function handleClickToday() {
    const newDate = today();
    setReservationDate(newDate);
    history.push(`/dashboard?date=${newDate}`);
  }

  function handleClickNext() {
    const newDate = next(reservationDate);
    setReservationDate(newDate);
    history.push(`/dashboard?date=${newDate}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {reservationDate}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <h3>Reservations</h3>
      <ReservationsList reservations={reservations} seatReserved={seatReserved} search={false} cancelled={cancelled} setCancelled={setCancelled}/>
      <ErrorAlert error={tablesError} />
      <h3>Tables</h3>
      <TablesList
        tables={tables}
        loadTables={loadTables}
        seatReserved={seatReserved}
        setSeatReserved={setSeatReserved}
        setTablesError={setTablesError}
        setSeatDeleted={setSeatDeleted}
        deleted={null}
      />
      <div>
        <button onClick={handleClickPrevious}>Previous</button>
        <button onClick={handleClickToday}>Today</button>
        <button onClick={handleClickNext}>Next</button>
      </div>
    </main>
  );
}

export default Dashboard;
