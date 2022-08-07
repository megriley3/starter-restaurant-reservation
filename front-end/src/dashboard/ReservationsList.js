import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateReservationStatus } from "../utils/api";

function ReservationsList({reservations, seatReserved, search, cancelled, setCancelled}){
    const [error, setError] = useState(null);

    const handleCancel = ({target}) => {
        const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
        if(result){
            setCancelled(target.value);
            updateReservationStatus(target.value, "cancelled")
                .catch(setError)
        }
    }

    if(Array.isArray(reservations)){
        const list = reservations.map((reservation, index) => {
            const {reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status} = reservation;
            if(search){
                return (
                    <tr key={reservation_id}>
                        <td>{reservation_date}</td>
                        <td>{reservation_time}</td>
                        <td>{last_name}</td>
                        <td>{first_name}</td>
                        <td>{mobile_number}</td>
                        <td>{people}</td>
                        <td>{reservation_date}</td>
                        <td data-reservation-id-status={reservation.reservation_id}>{status}</td>
                        <td><Link to={`/reservations/${reservation_id}/seat`} href={`/reservations/${reservation_id}`} className="btn btn-primary">Seat</Link></td>
                        <td><Link to={`/reservations/${reservation_id}/edit`} href={`/reservations/${reservation_id}/edit`}>Edit</Link></td>
                        <td><button onClick={handleCancel} data-reservation-id-cancel={reservation.reservation_id} value={reservation_id}>Cancel</button></td>
                    </tr>
                )
            } else if(status==="finished" || Number(seatReserved.finishedRes)===reservation_id || Number(cancelled)===reservation_id){
                return null
            } else if(status==="seated" || Number(seatReserved.reservation_id)===reservation_id ) {
                return (
                    <tr key={reservation_id}>
                        <td>{reservation_date}</td>
                        <td>{reservation_time}</td>
                        <td>{last_name}</td>
                        <td>{first_name}</td>
                        <td>{mobile_number}</td>
                        <td>{people}</td>
                        <td>{reservation_date}</td>
                        <td data-reservation-id-status={reservation.reservation_id}>seated</td>
                        <td></td>
                        <td><Link to={`/reservations/${reservation_id}/edit`} href={`/reservations/${reservation_id}/edit`}>Edit</Link></td>
                        <td><button onClick={handleCancel} data-reservation-id-cancel={reservation.reservation_id} value={reservation_id}>Cancel</button></td>
                    </tr>
                )
            } else if(status==="booked"){
                return (
                    <tr key={reservation_id}>
                        <td>{reservation_date}</td>
                        <td>{reservation_time}</td>
                        <td>{last_name}</td>
                        <td>{first_name}</td>
                        <td>{mobile_number}</td>
                        <td>{people}</td>
                        <td>{reservation_date}</td>
                        <td data-reservation-id-status={reservation.reservation_id}>{status}</td>
                        <td><Link to={`/reservations/${reservation_id}/seat`} href={`/reservations/${reservation_id}`} className="btn btn-primary">Seat</Link></td>
                        <td><Link to={`/reservations/${reservation_id}/edit`} href={`/reservations/${reservation_id}/edit`}>Edit</Link></td>
                        <td><button onClick={handleCancel} data-reservation-id-cancel={reservation.reservation_id} value={reservation_id}>Cancel</button></td>
                    </tr>
                )
            } 
        })
        return (
            <>
                <ErrorAlert error={error}/>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Mobile Number</th>
                            <th>People</th>
                            <th>Status</th>
                            <th>Seat</th>
                            <th>Edit</th>
                            <th>Cancel</th>
                        </tr>
                    </thead>
                    <tbody>{list}</tbody>
                </table>
            </>
        )
    }
    return null    
}

export default ReservationsList;
