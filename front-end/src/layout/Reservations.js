import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, editReservation, getReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import ReservationsForm from "./ReservationsForm";

function Reservations({ reservationDate, setReservationDate, edit }) {
  const history = useHistory();
  const [error, setError] = useState(null);
  const {reservation_id} = useParams();

  let initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState(initialFormData);
  useEffect(findReservation, [edit, reservation_id])

  function findReservation(){
    const abortController = new AbortController();
    if(edit){
      getReservation(reservation_id, abortController.signal)
        .then((res)=>{
          const date = res.reservation_date;
          const resDate = date.split("T")[0];
          const time = res.reservation_time;
          let resTime = time.split(":");
          resTime.pop();
          resTime = resTime.join(":");
          setFormData({...initialFormData,
            ...res,
            reservation_date: resDate,
            reservation_time: resTime
        }
        )})
        .catch(setError);
    }
    return () => abortController.abort();
  }

  if(edit){
    if(formData.status !=="booked"){
      return (
        <main>
          <h1>Edit Reservation</h1>
          <p>You cannot edit a reservation that's already been seated.</p>
          </main>
      )
    } else {
      return (
        <main>
          <h1>Edit Reservation</h1>
          <ReservationsForm formData={formData} setFormData={setFormData} reservationDate={reservationDate} setReservationDate={setReservationDate} edit={edit} />
        </main>
      )
    }
  }

  return (
    <main>
      <h1>New Reservation</h1>
      <ReservationsForm formData={formData} setFormData={setFormData} reservationDate={reservationDate} setReservationDate={setReservationDate} edit={edit} />
    </main>
  )

 
}

export default Reservations;
