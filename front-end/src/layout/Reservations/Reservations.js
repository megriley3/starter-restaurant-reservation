import React, {useState} from "react";

import {  Route, Switch, useRouteMatch } from "react-router-dom";
import Dashboard from "../../dashboard/Dashboard";
import NotFound from "../NotFound";
import Tables from "../Tables"
import { today } from "../../utils/date-time";
import SeatReservations from "../SeatReservations";
import NewReservation from "./NewReservation";

function Reservations(){
    const {path} = useRouteMatch();
    return(
            <Switch>
                <Route exact path={`${path}/new`}>
                    <NewReservation/>
                </Route>
            </Switch>
        
    )
}

export default Reservations