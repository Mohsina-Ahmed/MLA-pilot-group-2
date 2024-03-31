import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import config from '../config';
import { Mood, MoodBad, SentimentSatisfied, SentimentVeryDissatisfied } from '@mui/icons-material'; 

const Homepage = ({ currentUser }) => {
  // const [selectedEmoji, setSelectedEmoji] = useState(null);
  // const [pageBackgroundColor, setPageBackgroundColor] = useState('');

  // const handleEmojiSelect = (emoji) => {
  //   setSelectedEmoji(emoji);
  //   updateBackgroundColor(emoji);
  // };

  const updateBackgroundColor = (color) => {
    const navBar = document.getElementById("navBar");
    navBar.style.backgroundColor = color;
  };

  return (
    <div className="Homepage-container">
      <h4>Your week summary </h4>
      <p>Hello, {currentUser}!</p>
      <p>How are you today?:</p>
      <div className="emojis">
        <Mood className="emoji" onClick={() => updateBackgroundColor('#f0f8ff')} />
        <SentimentSatisfied className="emoji" onClick={() => updateBackgroundColor('#fffacd')} />
        <SentimentVeryDissatisfied className="emoji" onClick={() => updateBackgroundColor('#ffe4e1')} />
        <MoodBad className="emoji" onClick={() => updateBackgroundColor('#f08080')} />
      </div>
    </div>
  );
};

export default Homepage;
