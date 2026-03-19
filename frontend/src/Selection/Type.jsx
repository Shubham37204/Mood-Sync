import React, { useState } from 'react';
import './Type.css';
import EventDrop from './EventDrop';
import HabitDrop from './HabitDrop';
import TasteHabit from './TasteHabit';

const Type = ({ onSelectMediaType }) => {
    const [selectedType, setSelectedType] = useState('');
    const [redirected, setRedirected] = useState(false);

    const handleSelectMediaType = (type) => {
        onSelectMediaType(type);
    };

    const openRandomVideo = (selectedType) => {
        // Define your YouTube Data API key
        const apiKey = 'Your YouTube API key';

        // Make an API request to search for videos
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${selectedType} music&type=video&videoEmbeddable=true&part=snippet&maxResults=50&safeSearch=strict&videoDuration=medium`)
            .then(response => response.json())                                                    
            .then(data => {
                // Get a random video from the search results
                if (data.items.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.items.length);
                    const videoId = data.items[randomIndex].id.videoId;
                    const url = `https://www.youtube.com/watch?v=${videoId}`;

                    // Open the random video in a new tab
                    window.open(url, '_blank');
                } else {
                    console.error('No relevant videos found.');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const handleSearch = () => {
        if (selectedType.trim() !== '') {
            // Open random video based on the selected type
            openRandomVideo(selectedType);
            setRedirected(true); // Set redirected state to true
        } else {
            console.error('No selected type found.');
        }
    };

    return (
        <div className="type-container">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 flex flex-col items-center">
                    <button type="button" onClick={() => handleSelectMediaType('movie')} className="btn-movies py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <span id='btn-movies'>
                            MOVIES
                        </span>
                    </button>
                    <div className="mt-10"></div>
                    <button type="button" onClick={() => handleSelectMediaType('music')} className="btn-songs py-3 px-4 inline-flex items-center text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <span id='btn-songs'>
                            MUSIC
                        </span>
                    </button>
                </div>
                <div className="col-span-3 ml-4"><EventDrop id="eventDrop1" label="Event 1" onSelect={setSelectedType} /></div>
                <div className="col-span-3"><HabitDrop id="habitDrop1" label="Habit 1" onSelect={setSelectedType} /></div>
                <div className="col-span-3"><TasteHabit id="tasteHabit1" label="Taste Habit 1" onSelect={setSelectedType} /></div>
                <div className="col-span-3"></div>
                <div className="col-span-3"></div>
                <div className="col-span-3 flex justify-center">
                    <button type="button" className="btn-search py-3 px-4 inline-flex items-center text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" onClick={handleSearch}>
                        <span id='btn-search'>
                            SEARCH
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Type;