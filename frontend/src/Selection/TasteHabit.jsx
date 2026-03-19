import React from 'react'

const TasteHabit = ({ onSelect }) => {
    const handleChange = (event) => {
        onSelect(event.target.value);
    };

    return (
        <div>
            <form className="max-w-sm mx-auto">
                <select onChange={handleChange} id="large" className="block w-full px-4 py-3 text-base  rounded-lg ">
                    <option selected>Select your taste</option>
                    <option value="happy">happy</option>
                    <option value="sad">sad</option>
                    <option value="fear">fear</option>
                    <option value="angry">angry</option>
                </select>
            </form>
        </div>
    )
}

export default TasteHabit
