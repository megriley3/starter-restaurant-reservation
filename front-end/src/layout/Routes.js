import React, {useState} from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import Reservations from "./Reservations"
import { today } from "../utils/date-time";

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
  console.log(date);

  const [reservationDate, setReservationDate] = useState(date);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations">
        <Reservations reservationDate={reservationDate} setReservationDate={setReservationDate}/>
      </Route>
      <Route path="/dashboard">
        <Dashboard reservationDate={reservationDate} setReservationDate={setReservationDate}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
