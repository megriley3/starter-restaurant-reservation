import React, {useState, useEffect} from "react";
import ReservationsList from "../dashboard/ReservationsList";
import {listReservations} from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function Search({seatReserved}){
    const [mobile, setMobile] = useState("");
    const [searched, setSearched] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [cancelled, setCancelled] = useState("");
    const [error, setError] = useState(null)

    const handleChange = ({target})=>  {
        setSearched(false);
        setMobile(target.value);
}
    const handleSubmit = (event)=>{
        event.preventDefault();
        const abortController = new AbortController();
        setSearched(!searched);
        setMobile("");
        listReservations({mobile_number: mobile}, abortController.signal)
            .then(setSearchResults)
            .catch(setError)
        return () => abortController.abort();
    }

    if(searched){
        if(searchResults.length){
            const results = searchResults.map(({reservation_date, reservation_time, first_name, last_name, people, mobile_number}, index) => {
                return (
                    <tr key={index}>
                        <td>{reservation_date}</td>
                        <td>{reservation_time}</td>
                        <td>{last_name}</td>
                        <td>{first_name}</td>
                        <td>{people}</td>
                        <td>{mobile_number}</td>
                    </tr>
                )
            })
            return (
                <main>
                    <h3>Search for Reservation</h3>
                    <ErrorAlert error={error}/>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="mobile">
                            Mobile Number:
                            <input 
                                type="tel" 
                                name="mobile_number" 
                                id="mobile" 
                                onChange={handleChange} 
                                value={mobile} 
                                placeholder="Enter a customer's phone number" 
                                required
                            />
                        </label>
                        <button type="submit">Find</button>
                    </form>
                    <h3>Results</h3>
                    <ReservationsList reservations={searchResults} seatReserved={seatReserved} search={true} cancelled={cancelled} setCancelled={setCancelled}/>
                </main>
            )
        } else {
            return (
                <main>
                    <ErrorAlert error={error}/>
                    <h3>Search for Reservation</h3>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="mobile">
                            Mobile Number:
                            <input type="tel" name="mobile_number" id="mobile" onChange={handleChange} value={mobile} required/>
                        </label>
                        <button type="submit">Find</button>
                    </form>
                    <h3>Results</h3>
                    <p>No reservations found</p>
                </main>
            )
        }
 
    }
     
    return (
        <main>
            <ErrorAlert error={error}/>
            <h3>Search for Reservation</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="mobile">
                    Mobile Number:
                    <input type="tel" name="mobile_number" id="mobile" onChange={handleChange} value={mobile} required/>
                </label>
                <button type="submit">Find</button>
            </form>
        </main>
    )
}

export default Search