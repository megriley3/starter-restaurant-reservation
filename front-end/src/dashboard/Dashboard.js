import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date);

  useEffect(loadDashboard, [reservationDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations( {date: reservationDate} , abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
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
      {JSON.stringify(reservations)}
      <div>
        <button onClick={handleClickPrevious}>Previous</button>
        <button onClick={handleClickToday}>Today</button>
        <button onClick={handleClickNext}>Next</button>
      </div>
    </main>
  );
}

export default Dashboard;
