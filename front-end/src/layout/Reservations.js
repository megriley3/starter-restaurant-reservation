import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {createReservation} from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function Reservations({reservationDate, setReservationDate}){
    const history = useHistory();

    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    }
    
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null);

    const handleChange = ({target}) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        })
        let date = formData.reservation_date;
        date = date + "T00:00:00";
        date = new Date(date);
        const now = new Date();
        const day = date.getDay();
        if(date.getTime()<now.getTime() && day===2){
            setError({message: 'Reservation date has already passed and restaurant is closed on Tuesdays.'})
        } else if(date.getTime()<now.getTime()){
            setError({message: 'Reservation date has already passed.'})
        } else if(day===2){ 
            setError({message: 'Restaurant is closed on Tuesdays.'});
        }
        
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormData(initialFormData);
        let date = formData.reservation_date;
        setReservationDate(formData.reservation_date)
        createReservation(formData)
            .then(()=> history.push(`/dashboard?date=${reservationDate}`))
            .catch(setError);
    }

       return (
            <>
            <h1>New Reservation</h1>
            <ErrorAlert error={error}/>
            <form name="new" onSubmit={handleSubmit}>
                <label htmlFor="first_name">
                    First Name
                    <input name="first_name" id="first_name" value={formData.first_name} type="text" placeholder = "First Name" onChange={handleChange} required/>
                </label>
                <br/>
                <label htmlFor="last_name">
                    Last Name
                    <input name="last_name" id="last_name" value={formData.last_name} type="text" placeholder="Last Name" onChange={handleChange} required/>
                </label>
                <br/>
                <label htmlFor="mobile_number">
                    Mobile Number 
                    <input name="mobile_number" id="mobile_number" type="tel" min={10} value={formData.mobile_number} placeholder="Mobile Number" onChange={handleChange} required/>
                </label>
                <br/>
                <label htmlFor="reservation_date">
                    Reservation Date 
                    <input type="date" name="reservation_date" id="reservation_date" placeholder="yyyy-mm-dd" value={formData.reservation_date} onChange={handleChange} required/>
                </label>
                <br/>
                <label htmlFor="reservation_time">
                    Reservation Time 
                    <input type="time" name="reservation_time" id="reservation_time" value={formData.reservation_time} onChange={handleChange} required/>
                </label>
                <br/>
                <label htmlFor="people">
                    People
                    <input type="number" name="people" id="people" value={formData.people} onChange={handleChange} min="1" required/>
                </label>
                <br/>
                <button type="submit">Submit</button>
                <button onClick={() =>history.goBack()}>Cancel</button>
            </form>
            </>

    )
}

export default Reservations;