import React from 'react'

const HabitDrop = ({ onSelect }) => {
    const handleChange = (event) => {
        onSelect(event.target.value);
    };
    
    return (
        <div>
            < form className="max-w-sm mx-auto">
                <select onChange={handleChange} id="large" className="block w-full px-4 py-3 text-base  rounded-lg ">
                    <option selected>Choose your habit</option>
                    <option value="Cycling">Cycling</option>
                    <option value="Workout">Workout</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Driving">Driving</option>
                    <option value="Gaming">Gaming</option>
                </select>
            </form>
        </div >
    )
}

export default HabitDrop
