import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import Reservations from "./Reservations";
import Tables from "./Tables";
import Search from "./Search";
import { today } from "../utils/date-time";
import SeatReservations from "./SeatReservations";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const queryParams = new URLSearchParams(window.location.search);
  let date = queryParams.get("date");
  if (!date) date = today();

  const [reservationDate, setReservationDate] = useState(date);
  const [seatReserved, setSeatReserved] = useState({table_id: null, reservation_id: null, finishedRes: null});

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservations seatReserved={seatReserved} setSeatReserved={setSeatReserved} />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <Reservations
        reservationDate={reservationDate}
        setReservationDate={setReservationDate}
        edit={true}
        />
      </Route>
      <Route path="/reservations">
        <Reservations
          reservationDate={reservationDate}
          setReservationDate={setReservationDate}
          edit={false}
        />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          reservationDate={reservationDate}
          setReservationDate={setReservationDate}
          seatReserved={seatReserved}
          setSeatReserved={setSeatReserved}
        />
      </Route>
      <Route path="/tables">
        <Tables />
      </Route>
      <Route path="/search">
        <Search seatReserved={seatReserved}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
