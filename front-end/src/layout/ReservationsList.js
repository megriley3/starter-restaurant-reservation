import React from "react";

function ReservationsList({reservations}){
    if(Array.isArray(reservations)){
        const list = reservations.map(({reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people}, index) => {
            return (
                <li key={index}>
                    <h5>{reservation_time}</h5>
                    <p>Name: {first_name} {last_name}</p>
                    <p>Mobile Number: {mobile_number}</p>
                    <p>People: {people}</p>
                    <p>{reservation_date}</p>
                    <a href={`/reservations/${reservation_id}/seat`} className="btn btn-primary">Seat</a>
                </li>
            )
        })
        return <ul style={{listStyle: "none"}}>{list}</ul>
    }
    return null    
}

export default ReservationsList;
