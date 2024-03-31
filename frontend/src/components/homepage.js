import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import config from '../config';
import { Mood, MoodBad, SentimentSatisfied, SentimentVeryDissatisfied } from '@mui/icons-material'; 

const Homepage = ({ currentUser }) => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [pageBackgroundColor, setPageBackgroundColor] = useState('');

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    updateBackgroundColor(emoji);
  };

  const updateBackgroundColor = (emoji) => {
    if (emoji.type === Mood) {
      setPageBackgroundColor('#f0f8ff'); 
    } else if (emoji.type === SentimentSatisfied) {
      setPageBackgroundColor('#fffacd'); 
    } else if (emoji.type === SentimentVeryDissatisfied) {
      setPageBackgroundColor('#ffe4e1'); 
    } else if (emoji.type === MoodBad) {
      setPageBackgroundColor('#f08080'); 
    }
  };

  return (
    <div className="Homepage-container" style={{ backgroundColor: pageBackgroundColor }}>
      <h4>Your week summary </h4>
      <p>Hello, {currentUser}!</p>
      <p>How are you today?:</p>
      <div className="emojis">
        <Mood className="emoji" onClick={() => handleEmojiSelect(Mood)} />
        <SentimentSatisfied className="emoji" onClick={() => handleEmojiSelect(SentimentSatisfied)} />
        <SentimentVeryDissatisfied className="emoji" onClick={() => handleEmojiSelect(SentimentVeryDissatisfied)} />
        <MoodBad className="emoji" onClick={() => handleEmojiSelect(MoodBad)} />
      </div>
    </div>
  );
};

export default Homepage;
