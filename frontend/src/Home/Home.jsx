import React, { useState } from 'react';
import HomeFront from "./HomeFront";
import Mood from '../Mood/Mood';
import Type from '../Selection/Type';
import Detect from '../Selection/Detect';
import Voice from '../Mood/Voice';
import YouTubeRadio from './YouTubeRadio';

const Home = () => {
  const [selectedMediaType, setSelectedMediaType] = useState(null);

  const handleSelectMediaType = (type) => {
    setSelectedMediaType(type);
  };

  const handleStartDetection = () => {
    // Handle starting detection, you can send selectedMediaType to backend here
    console.log('Selected media type:', selectedMediaType);
  };

  return (
    <div>
      <HomeFront />
      <Mood />
      <Type onSelectMediaType={handleSelectMediaType} />
      <YouTubeRadio />
      <Detect selectedMediaType={selectedMediaType} onStartDetection={handleStartDetection} />
      {/* <Voice /> */}
    </div>
  );
};

export default Home;
