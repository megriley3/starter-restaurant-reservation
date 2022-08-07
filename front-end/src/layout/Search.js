import React, {useState, useEffect} from "react";
import {listReservations} from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function Search(){
    const [mobile, setMobile] = useState("");
    const [searched, setSearched] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null)

   /* useEffect(loadSearchResults, [mobile]);

    function loadSearchResults() {
        const abortController = new AbortController();
        setError(null);
        //console.log(mobile)
        listReservations({ mobile_number: mobile }, abortController.signal)
          .then(setSearchResults)
          .catch(setError);
        return () => abortController.abort();
      }*/
    
    //console.log(searched, "before");

    const handleChange = ({target})=>  {
        setSearched(false);
        setMobile(target.value);
}
    const handleSubmit = (event)=>{
        event.preventDefault();
        setSearched(!searched);
        setMobile("");
        listReservations({mobile_number: mobile})
            .then(setSearchResults)
            .catch(setError)
        //console.log(searched, "after")
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
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Last Name</th>
                                <th>First Name</th>
                                <th>People</th>
                                <th>Mobile</th>
                            </tr>
                        </thead>
                        <tbody>{results}</tbody>
                    </table>
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