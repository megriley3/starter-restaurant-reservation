import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {editReservation, createReservation} from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function ReservationsForm({formData, setFormData, reservationDate, setReservationDate, edit}){
    const [error, setError] = useState(null);
    const history = useHistory();

    let initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
      };

    const handleChange = ({ target }) => {
        if(target.name === "people"){
            setFormData({
                ...formData,
                people: Number(target.value)
            })
        } else{
            setFormData({
                ...formData,
                [target.name]: target.value,
              });
        }
        setError(null);
        let date = formData.reservation_date;
        date = date + "T00:00:00";
        date = new Date(date);
        const now = new Date();
        validDate(date, now);
      };


      const validDate = (date, now) => {
        const day = date.getDay();
        if (date.getTime() < now.getTime() && day === 2) {
          setError({
            message:
              "Reservation date has already passed and restaurant is closed on Tuesdays.",
          });
        } else if (date.getTime() < now.getTime()) {
          setError({ message: "Reservation date has already passed." });
        } else if (day === 2) {
          setError({ message: "Restaurant is closed on Tuesdays." });
        }
      };

      const validTime = () => {
        let date = formData.reservation_date;
        date = date + "T00:00:00";
        date = new Date(date);
        const now = new Date();
        const currHours = now.getHours();
        const currMinutes = now.getMinutes();
        const time = formData.reservation_time;
        const timeArray = time.split(":");
        const hours = timeArray[0];
        const minutes = timeArray[1];
        if (hours < 10 || (hours === 10 && minutes < 30))
          setError({ message: `Restaurant opens at 10:30` });
        if (
          date === now &&
          (hours < currHours || (hours === currHours && minutes < currMinutes))
        ) {
          setError({ message: `Reservations have to be in the future.` });
        }
        if (hours > 21 || (hours === 21 && minutes > 30)) {
          setError({
            message: `Reservations need to be an hour before closing time.`,
          });
        }
      };

      const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        validTime();
        setFormData(initialFormData);
        setReservationDate(formData.reservation_date);
        const date = formData.reservation_date;
        if(edit){
            editReservation(formData, abortController.signal)
                .then(()=>history.push(`/dashboard?date=${reservationDate}`))
                .catch(setError)
        } else {
            createReservation(formData, abortController.signal)
                .then(() => history.push(`/dashboard?date=${date}`))
                .catch(setError);
        }
        return () => abortController.abort();
      };

      return (
        <div>
            <ErrorAlert error={error} />
          <form name="new" onSubmit={handleSubmit}>
            <label htmlFor="first_name">
              First Name
              <input
                name="first_name"
                id="first_name"
                value={formData.first_name}
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label htmlFor="last_name">
              Last Name
              <input
                name="last_name"
                id="last_name"
                value={formData.last_name}
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label htmlFor="mobile_number">
              Mobile Number
              <input
                name="mobile_number"
                id="mobile_number"
                type="tel"
                min={10}
                value={formData.mobile_number}
                placeholder="Mobile Number"
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label htmlFor="reservation_date">
              Reservation Date
              <input
                type="date"
                name="reservation_date"
                id="reservation_date"
                placeholder="yyyy-mm-dd"
                value={formData.reservation_date}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label htmlFor="reservation_time">
              Reservation Time
              <input
                type="time"
                name="reservation_time"
                id="reservation_time"
                value={formData.reservation_time}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label htmlFor="people">
              People
              <input
                type="number"
                name="people"
                id="people"
                value={Number(formData.people)}
                onChange={handleChange}
                min="1"
                required
              />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
          <button onClick={() => history.goBack()}>Cancel</button>
        </div>
      )
}


export default ReservationsForm;