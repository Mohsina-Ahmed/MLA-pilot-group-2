import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@apollo/client';
import { LAST_EXERCISE_QUERY, CALORIES_QUERY, CALORIES_GOAL_QUERY } from './queries/graphql';
import { Mood, MoodBad, SentimentSatisfied, SentimentVeryDissatisfied } from '@mui/icons-material'; 
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Tooltip, Cell} from 'recharts';
import moment from 'moment';

const Homepage = ({ currentUser }) => {

  const lastExerciseResponse = useQuery(LAST_EXERCISE_QUERY, { 
    variables: { name: currentUser },
    notifyOnNetworkStatusChange: true,
    // Refetch when new exercises are added.
    fetchPolicy: 'cache-and-network' 
  });

  const [todayDate, setTodayDate] = useState(moment(new Date()).format('DD-MM-YYYY'));
  const caloriesResponse = useQuery(CALORIES_QUERY, { variables: 
    { name: currentUser, today_date: todayDate },
    notifyOnNetworkStatusChange: true,
    // Refetch when new exercises are added.
    fetchPolicy: 'cache-and-network' 
  });

  const caloriesGoalResponse = useQuery(CALORIES_GOAL_QUERY, { 
    variables: { name: currentUser },
    notifyOnNetworkStatusChange: true,
    // Refetch when new goal added.
    fetchPolicy: 'cache-and-network'
  
  });

  const [lastExercise, setLastExercise] = useState({
    exercise: '',
    duration: 0,
    date: ''
  });
  const [calories, setCalories] = useState({
    value: 0,
    goal: 0
  });

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [userHasExercise, setUserHasExercise] = useState(false);
  const [themeColor, setThemeColor] = useState('#F54996ff');

  useEffect( () => {
    if (lastExerciseResponse.data) {
      const lastExerciseResult = lastExerciseResponse.data.lastExercise;
      
      if (lastExerciseResult.success && lastExerciseResult.results.length > 0) {
        let lastEx = lastExerciseResult.results[0];
        setLastExercise({...lastEx, exercise: lastEx.exercise, duration: lastEx.duration, date: lastEx.date});
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
          calories.value = parseInt(calData.daily_calories);
        } else {
          calories.value = 0;
        }
    }
    } else {
      console.log('No response for calories.');
      }

      if (caloriesGoalResponse.data) {
        const goalResult = caloriesGoalResponse.data.caloriesGoal;
        
          if (goalResult.hasOwnProperty('results')) {
            if (goalResult.success && goalResult.results.length > 0) {
              const goalData = goalResult.results[0];
              if (goalData.value > 0) {
                calories.goal = parseInt(goalData.value);
                console.log(calories);
              } else {
                calories.goal = 500;
                console.log("No goal set by user, set default value...", calories);
              }
            } else {
              calories.goal = 500;
              console.log("No goal set by user, set default value...", calories);
            }
        }
        } else {
          calories.goal = 500;
          console.log('No response for calories goal.');
          }
  }, [caloriesResponse, caloriesGoalResponse, currentUser, todayDate]);
  
  const updateBackgroundColor = (emoji, color) => {
    setSelectedEmoji(emoji);
    setThemeColor(color);
    const navBar = document.getElementById("navBar");
    navBar.style.backgroundColor = color;
  };


  return (
    <div className="Homepage-container">
      <h3 style={{ marginBottom: '30px'}}>🌟 Your Daily Summary 🌟</h3>
      <h4 data-testid="title" style={{ marginBottom: '20px'}}>Hello, {currentUser}!</h4>
      <p style={{ marginBottom: '10px'}}>How are you today?:</p>
      <div className="emojis" style={{ marginBottom: '25px'}}>
        <IconButton className="emoji" data-testid="mood" color={selectedEmoji === 1 ? "primary" : "default"} onClick={() => updateBackgroundColor(1, '#83F0F3')}>
          <Mood fontSize='large' />
        </IconButton>
        <IconButton className="emoji" color={selectedEmoji === 2 ? "primary" : "default"} onClick={() => updateBackgroundColor(2, '#FBF071')}>
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
        <p style={{marginBottom: "5px"}}>Your last exercise was on</p> 
        <p>{lastExercise.date}:</p>
        <p data-testid="lastEx" style={{marginBottom: "5px"}}>Well done on {lastExercise.exercise}</p>
        <p>for {lastExercise.duration} minutes!</p>
        <h4>👏👏👏</h4>
        </div>
      ) : (
        <div>
        <p style={{marginBottom: "20px"}}>You have not logged an activity yet.</p>
        <p style={{marginBottom: "20px"}}>👇 Why don't you try it out? 👇</p>
        <Link to="/trackExercise">Track New Exercise</Link>
        </div>
      )}
      </Col>
      <Col>
      <div style={{ width: "100%", height: "200px" }}>
    <p style={{marginBottom: "10px"}}>Calories Burned Today:</p>
    <div style={{ width: "100%", height: "110px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          startAngle={90}
          endAngle={-270} 
          innerRadius={45} 
          outerRadius={60} 
          barSize={15} 
          data={[{ value: calories.value }]}
        >
          {/* Title */}
          <PolarAngleAxis
            type="number"
            domain={[0, calories.goal]}
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
              fill={calories.value >= calories.goal ? "#8884d8" : themeColor} // adjust colour for 100% goal
            />
          </RadialBar>
          {/* Label component for text */}
          <text x='50%' y='50%' textAnchor='middle' style={{ fontSize: 15, fontWeight: 'bold', dominantBaseline:'middle' }}>
            {`${calories.value}\n/ ${calories.goal}`}
          </text>
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
        { calories.value > 0 ? (
          <p style={{marginBottom: "0px"}}>Great work today 🔥</p>
        ) : (
          <p style={{marginBottom: "0px"}}>No exercise tracked today!</p>
        )
        }
      </div>
      </Col>
      </Row>  

      <Row>
      <p>
        Want to change your goals? <Link aria-label="Change calories goal" to="/userProfile">User Profile</Link>
      </p>
      </Row>
    </div>
  );
};

export default Homepage;
