import React, {useState} from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import Reservations from "./Reservations";
import Tables from "./Tables"
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
  if(!date) date = today();

  const [reservationDate, setReservationDate] = useState(date);
  const [tables, setTables] = useState([]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
     {/*} <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservations tables={tables} setTables={setTables} />
  </Route>*/}
      <Route path="/reservations">
        <Reservations reservationDate={reservationDate} setReservationDate={setReservationDate}/>
      </Route>
      <Route path="/dashboard">
        <Dashboard reservationDate={reservationDate} setReservationDate={setReservationDate} tables={tables} setTables={setTables}/>
      </Route>
      {/*<Route path="/tables">
        <Tables/>
      </Route>
     */} <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
