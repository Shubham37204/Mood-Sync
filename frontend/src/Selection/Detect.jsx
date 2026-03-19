import React, { useState } from 'react';
import './Detect.css';

const Detect = ({ selectedMediaType }) => {
    const [loading, setLoading] = useState(false);

    const handleStartDetection = () => {
        // Show loading message
        setLoading(true);

        // Include JWT token in Authorization header
        const token = sessionStorage.getItem('access_token');
        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        // Use fetch to trigger the emotion detection and media selection on the server
        fetch(`/detect_emotion?type=${selectedMediaType}`, {
            method: 'GET', // Assuming it's a GET request
            headers: headers,
            credentials: 'include', // Include cookies in the request
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle the response from the backend
                console.log('Selected media data:', data);
                setLoading(false);
                if (data && data.link) {
                    // Open the media link in a new tab
                    window.open(data.link, '_blank');
                } else {
                    console.error('No media link found in the response.');
                }
            })
            .catch(error => {
                console.error('Error detecting emotion and selecting media:', error);
                setLoading(false);
            });
    };

    return (
        <div className="detect-container">
            <div className="content">
                <div className="detect-title">Get started with emotion detection AI</div>
                <div className="button-container">
                    <button 
                        type="button" 
                        onClick={handleStartDetection} 
                        className={`dectect-btn  py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                        disabled={loading}
                    >
                        <span className='dectect-span'>Start Detection</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Detect;
