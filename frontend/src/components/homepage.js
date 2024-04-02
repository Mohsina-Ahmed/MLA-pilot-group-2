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
    value: 0,
    test: 0
  });

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [userHasExercise, setUserHasExercise] = useState(false);

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
          setCalories({ value: calData.daily_calories, test: 0 });
          console.log(calories);
        } else {
          setCalories({ value: 0, test: 0 });
        }
    }
    } else {
      console.log('No GraphQL response.');
      }
  }, [caloriesResponse, currentUser, todayDate]);
  
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
      <div width='100%' height='300px'>
      <text>Calories Burned Today: {calories.value}</text>
      <div width='100%' height='300px'>
      <ResponsiveContainer width='100%' height='100%' >
          <RadialBarChart 
            startAngle={90} // adjust start/end angle to make rotate clockwise
            endAngle={-270} 
            innerRadius={60}
            outerRadius={80} 
            barSize={15} 
            data={[calories]}
            >
            {/* Title */}
            <PolarAngleAxis
              type="number"
              domain={[0, calories.value]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={5}
              background
              clockWise={true}
              cornerRadius={10 / 2}
              dataKey="value"
            >
              <Cell
                  key={`cell-1`}
                  fill={ calories.value === 1000 ? "#49ff8f" : "#8884d8"} // adjust colour for 100% goal
                />
            </RadialBar>
            {/* Label component for text */}
            <text x='50%' y='50%' textAnchor='middle' style={{ fontSize: 20, fontWeight: 'bold', dominantBaseline:'middle' }}>
                  {`${calories.value}`}
            </text>
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
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
