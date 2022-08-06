import React, {useState} from "react";

function Search(){
    const [mobile, setMobile] = useState("");
    const handleChange = ({target})=> setMobile(target.value);
    const handleSubmit = (event)=>{
        event.preventDefault();
        console.log("submit")
    }

    return (
        <main>
            <h3>Search for Reservation</h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="mobile">
                    Mobile Number:
                    <input type="tel" name="mobile" id="mobile" onChange={handleChange} value={mobile} required/>
                </label>
                <br/>
                <button type="submit">Find</button>
            </form>
        </main>
    )
}

export default Search