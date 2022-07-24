import React, {useState} from "react";
import {useHistory} from "react-router-dom";

function Tables(){
    const history = useHistory();

    const initialTableData= {
        table_name: "",
        capacity: "",
    }
    
    const [tableData, setTableData] = useState(initialTableData)
   

    const handleChange = ({target})=>{
        setTableData({
            ...tableData,
            [target.name]: target.value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setTableData(initialTableData);
        history.push("/")

    }


    return (
        <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="table_name">
                Table Name:
                <input name="table_name" id="table_name" value={tableData.table_name} type="text" placeholder="Table Name" onChange={handleChange} required />
            </label>
            <br/>
            <label htmlFor="capacity">
                Capacity:
                <input name="capacity" id="capacity" value={tableData.capacity} type="number" min="1" onChange={handleChange} required />
            </label>
            <br/>
            <button type="submit">Submit</button>
            <button onClick={()=>history.goBack()}>Cancel</button>
        </form>
        </>
    )
}

export default Tables;