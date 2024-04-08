import React, { useEffect, useState } from 'react';
import { Button, Form, Col, Row, Dropdown, DropdownButton } from 'react-bootstrap';
import { trackExercise } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HappyIcon from '@mui/icons-material/SentimentVerySatisfied';
import PainfulIcon from "@mui/icons-material/MoodBad";
import UnhappyIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import NeutralIcon from "@mui/icons-material/SentimentSatisfied";
import TiredIcon from "@mui/icons-material/BatteryAlert";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import config from '../config';
import axios from 'axios';


const TrackExercise = ({ currentUser }) => {
  const [state, setState] = useState({
    exerciseType: '',
    description: '',
    duration: 0,
    distance: 0,
    speed: 0,
    pace: 0,
    sets: 0,
    reps: 0,
    date: new Date(),
    intensity: 3, // Set default MET as 3 which is relative to walking.
    calories: 0,
    mood: ''
  });

  const [message, setMessage] = useState('');

  // States used to track type of exercise being recorded, if other or custom selected by user. Update with one var.
  const [exerciseName, setExerciseName] = useState("normal");

  // Variable to store weight logged by user in profile. If empty, assumed average weight of 75kg for calories calculation.
  const [userWeight, setUserWeight] = useState(75);

  // Fetching weight data from user profile stored in authentication service.
  const fetchUserWeight = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/auth/profile/${currentUser}`);

      if (response.status === 200) {
        const userData = response.data;
        if (parseInt(userData.weight) > 0) {
          setUserWeight(parseInt(userData.weight));
        } else {
          console.log("User has not set a weight, average of 75kg applied.")
          setUserWeight(75); // Set an average weight value for calorie calculation.
        };
        
      } else {
        console.log('Failed to fetch user data.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    console.log(`Fetching user data for ${currentUser}...`);
    fetchUserWeight();
  }, [currentUser]);

  const calculateSpeed = () => {
    if (state.distance > 0) {
      state.speed = (state.distance / (state.duration / 60)).toFixed(2);
    } else {
      state.speed = 0;
    };
    return state.speed;
    };

  const calculatePace = () => {
    if (state.distance > 0) {
      state.pace = (state.duration / state.distance).toFixed(2);
    } else {
      state.pace = 0;
    };
    return state.pace;
    };

  const calculateCalories = () => {
    if (state.duration > 0) {
      const MET = parseInt(state.intensity) + 2;
      state.calories = ((( MET * userWeight * 3.5 ) / 200 ) * state.duration).toFixed(0); // Calorie calculation using METs - source: https://www.calories.info/calories-burned-calculator#:~:text=For%20a%20visual%20of%20the,the%20number%20of%20calories%20burned.
    } else {
      state.calories = 0;
    };
    return state.calories;
  };

  const updateExercise = (exercise, type) => {
    if (type === "other") {
      setState({ ...state, exerciseType: exercise });
      setExerciseName(type);
    } else if (type === "custom") {
      setState({ ...state, exerciseType: exercise });
      setExerciseName(type);
    } else {
      setState({ ...state, exerciseType: exercise });
      setExerciseName("normal");
    }
  };

  const toTitleCase = (str) => {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const currDate = new Date();
    if (state.exerciseType === '') {
      setMessage("Please check you have selected an exercise!");
    } else if (state.date > currDate) {
      setMessage("Please check the date and try again.");
      return;
    } else if (state.duration < 0) {
      setMessage("Please check the duration is a positive value!");
      return;
    } else if (state.distance < 0) {
      setMessage("Please check the distance is a positive value!");
      return;
    } else if (state.mood === '') {
      setMessage("Don't forget to log how the activity felt!");
    } else if (userWeight );

    const dataToSubmit = {
      username: currentUser,
      ...state,
    };

    try {
      const response = await trackExercise(dataToSubmit);
      console.log(response.data);

      setState({
        exerciseType: '',
        description: '',
        duration: 0,
        distance: 0,
        speed: 0,
        pace: 0,
        sets: 0,
        reps: 0,
        date: new Date(),
        intensity: 3,
        calories: 0,
        mood: '',
      });

      setMessage('Activity logged successfully! Well done!');
      setTimeout(() => setMessage(''), 2000);
      
    } catch (error) {
      console.error('There was an error logging your activity!', error);
    }
  };
  return (
    <div>
      <h3>Track exercise</h3>
      <Form onSubmit={onSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
        <Row>
        <div style={{ marginBottom: '20px' }}>
          <Tooltip title="Running">
          <IconButton aria-label="Running" data-testid="Run Icon" color={state.exerciseType === 'Running' ? "primary" : "default"} onClick={() => updateExercise("Running", "none")}>
            <DirectionsRunIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Cycling">
          <IconButton aria-label="Cycling" color={state.exerciseType === 'Cycling' ? "primary" : "default"} onClick={() => updateExercise("Cycling", "none")}>
            <DirectionsBikeIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Swimming">
          <IconButton aria-label="Swimming" color={state.exerciseType === 'Swimming' ? "primary" : "default"} onClick={() => updateExercise("Swimming", "none")}>
            <PoolIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Workout">
          <IconButton aria-label="Gym workout" data-testid="Gym Icon" color={state.exerciseType === 'Gym' ? "primary" : "default"} onClick={() => updateExercise("Gym", "none")}>
            <FitnessCenterIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Walking">
          <IconButton aria-label="Walking" color={state.exerciseType === 'Walking' ? "primary" : "default"} onClick={() => updateExercise("Walking", "none")}>
            <DirectionsWalkOutlinedIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip data-testid="other icon" title="Other Activity">
          <IconButton aria-label="Other activities" color={exerciseName === "other" || exerciseName === "custom"  ? "primary" : "default"} onClick={() => updateExercise("Other", "other")}>
            <AddCircleOutlineIcon fontSize="large" /> 
          </IconButton>  
          </Tooltip>
        </div>
        </Row>
        <Row style={{ marginBottom: '20px' }}>
        <div id="div-other" className={exerciseName === "other" ? "div-other" : "invisible"}>            
          <Dropdown>
            <DropdownButton data-testid="other dropdown" title={state.exerciseType === "Other" ? "Which activity would you like to track?" : state.exerciseType}>
              <Dropdown.Item aria-label="Rowing" onClick={() => updateExercise("Rowing", "other")}>Rowing &#128675;</Dropdown.Item>
              <Dropdown.Item aria-label="Football" onClick={() => updateExercise("Football", "other")}>Football &#9917;</Dropdown.Item>
              <Dropdown.Item aria-label="Skiing" onClick={() => updateExercise("Skiing", "other")}>Skiing &#9975;</Dropdown.Item>
              <Dropdown.Item aria-label="Golf" onClick={() => updateExercise("Golf", "other")}>Golf &#9971;</Dropdown.Item>
              <Dropdown.Item aria-label="Horse Riding" onClick={() => updateExercise("Horse Riding", "other")}>Horse Riding &#127943;</Dropdown.Item>
              <Dropdown.Item aria-label="Climbing" onClick={() => updateExercise("Climbing", "other")}>Climbing &#129495;</Dropdown.Item>
              <Dropdown.Item aria-label="Surfing" onClick={() => updateExercise("Surfing", "other")}>Surfing &#127940;</Dropdown.Item>
              <Dropdown.Item data-testid="custom option" aria-label="Add custom activity" onClick={() => updateExercise("", "custom")}>Custom Activity &#x2795;</Dropdown.Item>
            </DropdownButton>
          </Dropdown>
        </div>
        <Form.Group aria-label="Enter custom activity" data-testid="custom" id="custom" className={exerciseName === "custom" ? "default" : "invisible"}>
        <Form.Label>Enter the activity you want to track:</Form.Label>
          <Form.Control
            placeholder="e.g. Wheelchair Basketball"
            as="textarea"
            fontSize="large"
            rows={1}
            required 
            value={state.exerciseType} 
            onChange={(e) => updateExercise(toTitleCase(e.target.value),"custom")}
          />
        </Form.Group>
        </Row>
        <Row>
          <Form.Group aria-label="Activity title" controlId="description" style={{ marginBottom: '40px' }}>
          <Form.Label>Title your activity:</Form.Label>
          <Form.Control
            data-testid="title"
            placeholder={state.exerciseType} 
            as="textarea"
            fontSize="large"
            rows={1}
            required 
            value={state.description} 
            onChange={(e) => setState({ ...state, description: e.target.value })}
          />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group aria-label="Activity date" controlId="formDate" className="form-margin">
          <Form.Label>Date:</Form.Label>
          <DatePicker 
            selected={state.date}
            onChange={(date) => setState({ ...state, date })}
            dateFormat="dd/MM/yyyy"
            calendarStartDay={1} // set monday as start of week
          />
          </Form.Group>
        </Row>
        <Row>
          <Col>
          <Form.Group aria-label="Duration in minutes" controlId="duration" data-testid="duration" style={{ marginBottom: '40px' }}>
            <Form.Label>Duration (in minutes):</Form.Label>
            <Form.Control 
              type="number" 
              required 
              value={state.duration} 
              onChange={(e) => setState({ ...state, duration: e.target.value })}
            />
          </Form.Group>
          </Col>
          <Col className={state.exerciseType === 'Gym' ? "invisible" : "col"}>
          <Form.Group aria-label="Distance in kilometres" controlId="distance" data-testid="distance" className={state.exerciseType === 'Gym' ? "invisible" : "col"} style={{ marginBottom: '40px' }}>
            <Form.Label>Distance (in kilometers):</Form.Label>
            <Form.Control 
              type="number"
              value={state.distance} 
              onChange={(e) => setState({ ...state, distance: e.target.value })}
            />
          </Form.Group>
          </Col>
        </Row>
        <Row className={state.exerciseType === 'Gym' ? "invisible" : "row"}>
          <Col>
          <Tooltip title="Auto-calculated.">
          <Form.Group aria-label="Calculated speed" controlId="speed" data-testid="speed" className={state.exerciseType === 'Gym' ? "invisible" : "row"} style={{ marginBottom: '40px' }}>
            <Form.Label>Speed (km/hr):</Form.Label>
            <Form.Control 
              type="number"
              value={calculateSpeed()} 
            />
          </Form.Group>
          </Tooltip>
          </Col>
          <Col>
          <Tooltip title="Auto-calculated.">
          <Form.Group aria-label="Calculated pace" controlId="pace" data-testid="pace" className={state.exerciseType === 'Gym' ? "invisible" : "row"} style={{ marginBottom: '40px' }}>
            <Form.Label>Pace (min/km):</Form.Label>
            <Form.Control 
              type="number"
              value={calculatePace()} 
            />
          </Form.Group>
          </Tooltip>
          </Col>
        </Row>
        <Row className={state.exerciseType === 'Gym' || exerciseName === "custom" ? "row" : "invisible"}>
          <Col>
          <Form.Group aria-label="Number of sets" controlId="sets" data-testid="sets" className={state.exerciseType === 'Gym' || exerciseName === "custom" ? "row" : "invisible"} style={{ marginBottom: '40px' }}>
            <Form.Label>Number of Sets:</Form.Label>
            <Form.Control 
              type="number"
              value={state.sets} 
              onChange={(e) => setState({ ...state, sets: e.target.value })}
            />
          </Form.Group>
          </Col>
          <Col>
          <Form.Group aria-label="Number of reps" controlId="reps" data-testid="reps" className={state.exerciseType === 'Gym' || exerciseName === "custom" ? "row" : "invisible"} style={{ marginBottom: '40px' }}>
            <Form.Label>Number of Reps per set:</Form.Label>
            <Form.Control 
              type="number"
              value={state.reps} 
              onChange={(e) => setState({ ...state, reps: e.target.value })}
            />
          </Form.Group>
          </Col>
        </Row>
        <Row style={{ marginBottom: '20px' }}>
        <Col style={{ maxWidth: '65%' }}>
        <Tooltip title="How exerting was this exercise? &#10; 0️⃣ = Normal breathing, no effort, e.g. a stroll. &#10; 🔟 = Maximum effort, heavy breathing - e.g. sprinting.">
        <Form.Group aria-label="Exercise intensity" controlId="intensity" data-testid="intensity">
          <Form.Label>
          Exercise Intensity:
          </Form.Label>
          <Form.Range
            min={0}
            max={10}
            value={state.intensity}
            onChange={(e) => setState({ ...state, intensity: e.target.value })}
          />
          <p>{state.intensity}</p>
        </Form.Group>
        </Tooltip>
        </Col>
        <Col style={{ maxWidth: '35%' }}>
        <Tooltip title="This calculation uses your weight, make sure this is up to date. This is done on the User Profile page!">
          <Form.Group aria-label="Calculated calories burned" controlId="calories" data-testid="calories">
            <Form.Label>Calories 🔥:</Form.Label>
            <Form.Control 
              type="number"
              value={calculateCalories()} 
            />
          </Form.Group>
        </Tooltip>
        </Col>
        </Row>
        <Row>
          <div style={{ marginBottom: '20px' }}>
            <p aria-label="How the activity felt" fontSize="medium" style={{ marginBottom: '10px' }}>How did it feel?</p>
            <Tooltip title="That felt good / easy - yay 😃">
              <IconButton aria-label="Great" data-testid="Happy" color={state.mood === 'Happy' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Happy' })}>
                <HappyIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="That felt OK - could have been better 🙂">
              <IconButton aria-label="OK" color={state.mood === 'Neutral' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Neutral' })}>
                <NeutralIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="That was difficult - glad it's over 🥵">
              <IconButton aria-label="Difficult" color={state.mood === 'Difficult' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Difficult' })}>
                <UnhappyIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ouch - that was painful 😓">
              <IconButton aria-label="Painful" color={state.mood === 'Painful' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Painful' })}>
                <PainfulIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title="That was tiring - no energy 😴">
              <IconButton aria-label="Tiring" color={state.mood === 'Tiring' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Tiring' })}>
                <TiredIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </div>
        </Row>
        <Button aria-label="Save activity" data-testid="submit" variant="success" type="submit">
          Save activity
        </Button>
      </Form>
      {message && <p data-testid="message" style={message === 'Activity logged successfully! Well done!' ? {color: 'green'} : {color: 'red'} }>{message}</p>}
    </div>
  );
};

export default TrackExercise;
