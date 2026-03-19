import React from 'react'

const EventDrop = ({ onSelect }) => {
    const handleChange = (event) => {
        onSelect(event.target.value);
    };
    
    return (
        <div>
            <form className="max-w-sm mx-auto">
                <select onChange={handleChange} id="large" className="block w-full px-4 py-3 text-base  rounded-lg ">
                    <option selected>Choose your event</option>
                    <option value="marriage">Marriage</option>
                    <option value="concert">Concert</option>
                    <option value="Sports">Sports</option>
                    <option value="Stand up comedy">Stand up comedy</option>

                </select>
            </form>
        </div>
    )
}

export default EventDrop
