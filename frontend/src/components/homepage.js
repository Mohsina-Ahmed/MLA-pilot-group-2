import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@apollo/client';
import { LAST_EXERCISE_QUERY, CALORIES_QUERY } from './queries/graphql';
import { Mood, MoodBad, SentimentSatisfied, SentimentVeryDissatisfied } from '@mui/icons-material'; 
import { BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell} from 'recharts';
import moment from 'moment';

const Homepage = ({ currentUser }) => {

  const lastExerciseResponse = useQuery(LAST_EXERCISE_QUERY, { variables: { name: currentUser } });

  const [todayDate, setTodayDate] = useState(moment(new Date()).format('DD-MM-YYYY'));
  const caloriesResponse = useQuery(CALORIES_QUERY, { variables: { name: currentUser, today_date: todayDate } });

  const [lastExercise, setLastExercise] = useState({
    exercise: '',
    duration: 0,
    date: ''
  });
  const [calories, setCalories] = useState({
    value: 0
  });

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [userHasExercise, setUserHasExercise] = useState(false);
  const [themeColor, setThemeColor] = useState('#F54996ff');

  useEffect( () => {
    if (lastExerciseResponse.data) {
      const lastExerciseResult = lastExerciseResponse.data.homePage;
      
      if (lastExerciseResult.success && lastExerciseResult.results.length > 0) {
        let lastEx = lastExerciseResult.results[0];
        setLastExercise({...lastEx, exercise: lastEx.exercise, duration: lastEx.duration, date: lastEx.date.split(' ', 1)});
        // Setting that user has an exercise so that page can render accordingly.
        setUserHasExercise(true);
      } else {
        console.log('No last exercise found.');
      }
    } else {
      console.log('No GraphQL response.');
    }
  }, [lastExerciseResponse, currentUser]);

  useEffect( () => {

    if (caloriesResponse.data) {
    const caloriesResult = caloriesResponse.data.dailyCalories;
    
      if (caloriesResult.hasOwnProperty('results')) {
        if (caloriesResult.success && caloriesResult.results.length > 0) {
          const calData = caloriesResult.results[0];
          setCalories({ value: calData.daily_calories });
          console.log(calories);
        } else {
          setCalories({ value: 0 });
        }
    }
    } else {
      console.log('No GraphQL response.');
      }
  }, [caloriesResponse, currentUser, todayDate]);
  
  const updateBackgroundColor = (emoji, color) => {
    setSelectedEmoji(emoji);
    setThemeColor(color);
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
        <IconButton className="emoji" color={selectedEmoji === 3 ? "primary" : "default"} onClick={() => updateBackgroundColor(3, '#A0F0A4')}>
          <SentimentVeryDissatisfied fontSize='large' />
        </IconButton>
        <IconButton className="emoji" color={selectedEmoji === 4 ? "primary" : "default"} onClick={() => updateBackgroundColor(4, '#F54996ff')}>
          <MoodBad fontSize='large' />
        </IconButton>
      </div>
      <Row>
      <Col>
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
      </Col>
      <Col>
      <div>
        <p style={{marginBottom: "20px"}}>Calories Burned Today: {calories.value}</p>
        <div class="progress" style={{height: "40px", marginBottom: "20px"}}>
          <div class="progress-bar progress-bar-striped progress-bar-animated" style={{width: "50%"}} color={themeColor} aria-valuenow={parseInt(calories.value)} aria-valuemin="0" aria-valuemax="1000">{calories.value}</div>
        </div>
        { calories.value > 0 ? (
          <p>Great work today 🔥</p>
        ) : (
          <p>Have you tracked today's exercise?</p>
        )
        }
      </div>
      </Col>
      </Row>   
      
    </div>
  );
};

export default Homepage;
