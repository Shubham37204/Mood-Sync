import React, { useState } from 'react';

function YouTubeRadio() {
  const [searchQuery, setSearchQuery] = useState('');
  const [redirected, setRedirected] = useState(false);

  // Function to open a new tab with a random YouTube video of the selected music type
  function openRandomVideo(musicType) {
    // Define your YouTube Data API key
    const apiKey = 'Your YouTube API key';

    // Make an API request to search for videos
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${musicType} music&type=video&videoEmbeddable=true&part=snippet&maxResults=50&safeSearch=strict&videoDuration=medium`)
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
  }

  // Function to handle input change
  function handleInputChange(event) {
    setSearchQuery(event.target.value);
    setRedirected(false); // Reset redirected state when input changes
  }

  // Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();

    // Open random video based on the search query
    openRandomVideo(searchQuery.toLowerCase());
    setRedirected(true); // Set redirected state to true
  }

  return (
    <div className="flex justify-center items-center h-screen" style={{ backgroundColor: "#242121", height: "25pc" }}>
      {redirected ? (

        <div className="max-w-md mx-auto">
          {/* <p className="text-lg font-medium text-gray-900 mb-2">Search:</p> */}
          <input
            style={{ "width": " 28pc", "margin-top": "-8pc", "border": " 2px solid" }}
            type="text"
            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
        </div>
      ) : (
        <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only"> Search</label>
          <div className="relative">
            <input style={{ "width": " 28pc", "margin-top": "-8pc", "border": " 2px solid" }} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..." value={searchQuery} onChange={handleInputChange} required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default YouTubeRadio;
