import React from "react";
import {Link} from "react-router-dom";

function ReservationsList({reservations, seatReserved}){
    if(Array.isArray(reservations)){
        const list = reservations.map((reservation, index) => {
            const {reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status} = reservation;
            console.log(seatReserved.reservation_id, "seatReserved", reservation_id, "resId", Number(seatReserved.reservation_id)===reservation_id)
            
            if(status==="seated" || Number(seatReserved.reservation_id)===reservation_id ) {
                return (
                    <tr key={index}>
                        <td>{reservation_time}</td>
                        <td>{last_name}</td>
                        <td>{first_name}</td>
                        <td>{mobile_number}</td>
                        <td>{people}</td>
                        <td>{reservation_date}</td>
                        <td data-reservation-id-status={reservation.reservation_id}>seated</td>
                    </tr>
                )
            } else if(status==="booked"){
                return (
                    <tr key={index}>
                        <td>{reservation_time}</td>
                        <td>{last_name}</td>
                        <td>{first_name}</td>
                        <td>{mobile_number}</td>
                        <td>{people}</td>
                        <td>{reservation_date}</td>
                        <td data-reservation-id-status={reservation.reservation_id}>{status}</td>
                        <td><Link to={`/reservations/${reservation_id}/seat`} href={`/reservations/${reservation_id}`} className="btn btn-primary">Seat</Link></td>
                    </tr>
                )
            } 
        })
        return (
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Mobile Number</th>
                        <th>People</th>
                        <th>Status</th>
                        <th>Seat</th>
                    </tr>
                </thead>
                <tbody>{list}</tbody>
            </table>
        )
    }
    return null    
}

export default ReservationsList;
