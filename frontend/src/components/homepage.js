import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import './journal.css';
import config from '../config';
import { Mood, MoodBad, SentimentSatisfied, SentimentVeryDissatisfied } from '@mui/icons-material'; 

const Journal = ({ currentUser }) => {
  const [startDate, setStartDate] = useState(moment().startOf('week').toDate());
  const [endDate, setEndDate] = useState(moment().endOf('week').toDate());
  const [exercisesSummary, setExercisesSummary] = useState(null); 
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, [currentUser, startDate, endDate]);

  const fetchExercises = async () => {
    try {
      const url = `${config.apiUrl}/stats/weekly/?user=${currentUser}&start=${moment(startDate).format('DD-MM-YYYY')}&end=${moment(endDate).format('DD-MM-YYYY')}`;
      const response = await axios.get(url);
      console.log('API Response:', response.data);
      if (response.data.stats && Array.isArray(response.data.stats)) {
        calculateExercisesSummary(response.data.stats);
      } else {
        console.error('Unexpected response structure:', response.data);
        setExercisesSummary(null);
      }
    } catch (error) {
      console.error('Failed to fetch exercises', error);
    }
  };

  const calculateExercisesSummary = (exercises) => {
    const totalDuration = exercises.reduce((acc, curr) => acc + curr.totalDuration, 0);
    const numExercises = exercises.length;
    setExercisesSummary({ totalDuration, numExercises });
  };

  const goToPreviousWeek = () => {
    setStartDate(moment(startDate).subtract(1, 'weeks').startOf('week').toDate());
    setEndDate(moment(endDate).subtract(1, 'weeks').endOf('week').toDate());
  };

  const goToNextWeek = () => {
    setStartDate(moment(startDate).add(1, 'weeks').startOf('week').toDate());
    setEndDate(moment(endDate).add(1, 'weeks').endOf('week').toDate());
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };

  let pageBackgroundColor = '';
  let navbarColor = '';

  if (selectedEmoji === <Mood />) {
    pageBackgroundColor = '#f0f8ff'; 
    navbarColor = '#87CEFA'; 
  } else if (selectedEmoji === <SentimentSatisfied />) {
    pageBackgroundColor = '#fffacd'; 
    navbarColor = '#ffd700'; 
  } else if (selectedEmoji === <SentimentVeryDissatisfied />) {
    pageBackgroundColor = '#ffe4e1'; 
    navbarColor = '#ff7f50'; 
  } else if (selectedEmoji === <MoodBad />) {
    pageBackgroundColor = '#f08080'; 
    navbarColor = '#dc143c'; 
  }

  return (
    <div className="journal-container" style={{ backgroundColor: pageBackgroundColor }}>
      <NavbarComponent navbarColor={navbarColor} />
      <h4>Your week summary </h4>
      <p>Hello, {currentUser}!</p>
      <p>How are you today?:</p>
      <div className="emojis">
        <Mood className="emoji" onClick={() => handleEmojiSelect(<Mood />)} />
        <SentimentSatisfied className="emoji" onClick={() => handleEmojiSelect(<SentimentSatisfied />)} />
        <SentimentVeryDissatisfied className="emoji" onClick={() => handleEmojiSelect(<SentimentVeryDissatisfied />)} />
        <MoodBad className="emoji" onClick={() => handleEmojiSelect(<MoodBad />)} />
      </div>
      <div className="date-range">
        <Button className="button-small" onClick={goToPreviousWeek}>&larr; Previous</Button>
        <span>{moment(startDate).format('DD-MM-YYYY')} to {moment(endDate).format('DD-MM-YYYY')}</span>
        <Button className="button-small" onClick={goToNextWeek}>Next &rarr;</Button>
      </div>
      <div className="summary">
        {exercisesSummary && (
          <p>Total number of exercises: {exercisesSummary.numExercises}, Total duration: {exercisesSummary.totalDuration} minutes</p>
        )}
      </div>
    </div>
  );
};

const NavbarComponent = ({ navbarColor }) => {
  return (
    <nav className="navbar" style={{ backgroundColor: navbarColor }}>
      <h2>Navbar</h2>
    </nav>
  );
};

export default Journal;
