import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@apollo/client';
import { LAST_EXERCISE_QUERY } from './queries/graphql';
import { Mood, MoodBad, SentimentSatisfied, SentimentVeryDissatisfied } from '@mui/icons-material'; 

const Homepage = ({ currentUser }) => {

  const lastExerciseResponse = useQuery(LAST_EXERCISE_QUERY, { variables: { name: currentUser }, fetchPolicy: 'cache-and-network' });
  const [lastExercise, setLastExercise] = useState({
    exercise: '',
    duration: 0,
    date: ''
  });
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [userHasExercise, setUserHasExercise] = useState(false);

  useEffect( () => {
    console.log(lastExerciseResponse.data);
    if (lastExerciseResponse.data) {
      const lastExerciseResult = lastExerciseResponse.data.homePage;
      
      if (lastExerciseResult.success && lastExerciseResult.results.length > 0) {
        let lastEx = lastExerciseResult.results[0];
        setLastExercise({...lastEx, exercise: lastEx.exercise, duration: lastEx.duration, date: lastEx.date.split(' ', 1)});
        setUserHasExercise(true);
      } else {
        console.log('No last exercise found.');
      }
    } else {
      console.log('No GraphQL response.');
    }
  }, [lastExerciseResponse, currentUser]);
  
  const updateBackgroundColor = (emoji, color) => {
    setSelectedEmoji(emoji);
    const navBar = document.getElementById("navBar");
    navBar.style.backgroundColor = color;
  };


  return (
    <div className="Homepage-container">
      <h3 style={{ marginBottom: '40px'}}>🌟 Your Daily Summary 🌟</h3>
      <h4 style={{ marginBottom: '20px'}}>Hello, {currentUser}!</h4>
      <p style={{ marginBottom: '10px'}}>How are you today?:</p>
      <div className="emojis" style={{ marginBottom: '40px'}}>
        <IconButton className="emoji" color={selectedEmoji === 1 ? "primary" : "default"} onClick={() => updateBackgroundColor(1, '#B9F4F3')}>
          <Mood fontSize='large' />
        </IconButton>
        <IconButton className="emoji" color={selectedEmoji === 2 ? "primary" : "default"} onClick={() => updateBackgroundColor(2, '#fffacd')}>
          <SentimentSatisfied fontSize='large' />
        </IconButton>
        <IconButton className="emoji" color={selectedEmoji === 3 ? "primary" : "default"} onClick={() => updateBackgroundColor(3, '#ffe4e1')}>
          <SentimentVeryDissatisfied fontSize='large' />
        </IconButton>
        <IconButton className="emoji" color={selectedEmoji === 4 ? "primary" : "default"} onClick={() => updateBackgroundColor(4, '#f08080')}>
          <MoodBad fontSize='large' />
        </IconButton>
      </div>
      {userHasExercise ? (
        <div>
        <p>Your last exercise was on {lastExercise.date}:</p>
        <p>Well done on {lastExercise.exercise} for {lastExercise.duration} minutes!</p>
        <h4>👏👏👏</h4>
        </div>
      ) : (
        <div>
        <p>You have not logged an activity yet.</p>
        <Link to="/trackExercise">Head to the Track New Exercise page to try it out!</Link>
        </div>
      )}
      
    </div>
  );
};

export default Homepage;
