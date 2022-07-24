import React from "react";

function ReservationsList(reservations){
    //iterate through an object?
    if(Array.isArray(reservations)){
        const list = reservations.map((reservation, index) => {
            const reservation_id = reservation.reservation_id;
            return (
                <li key={index}>
                    {reservation}
                    <button href={`/reservations/${reservation_id}/seat`}>Seat</button>
                </li>
            )
        })
        return <ul>{list}</ul>
    }
    return null    
}

export default ReservationsList;
