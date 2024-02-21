import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { trackExercise } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import BikeIcon from '@material-ui/icons/DirectionsBike';
import PoolIcon from '@material-ui/icons/Pool';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import OtherIcon from '@material-ui/icons/HelpOutline';
import HappyIcon from '@material-ui/icons/SentimentVerySatisfied';
import PainfulIcon from "@material-ui/icons/MoodBad";
import UnhappyIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import NeutralIcon from "@material-ui/icons/SentimentSatisfied";
import TiredIcon from "@material-ui/icons/BatteryAlert";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TrackExercise = ({ currentUser }) => {
  const [state, setState] = useState({
    exerciseType: '',
    description: '',
    duration: 0,
    distance: 0,
    sets: 0,
    reps: 0,
    date: new Date(),
    mood: '',
  });
  const [message, setMessage] = useState(''); 

  const calculateSpeed = () => {
    if (state.distance > 0) {
      state.speed = state.distance / (state.duration / 60);
      return state.speed;
    } else {
      state.speed = 0;
      return state.speed;
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();

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
        sets: 0,
        reps: 0,
        date: new Date(),
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
        <div style={{ marginBottom: '20px' }}>
          <Tooltip title="Running">
          <IconButton color={state.exerciseType === 'Running' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Running' })}>
            <DirectionsRunIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Cycling">
          <IconButton color={state.exerciseType === 'Cycling' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Cycling' })}>
            <BikeIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Swimming">
          <IconButton color={state.exerciseType === 'Swimming' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Swimming' })}>
            <PoolIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Workout">
          <IconButton color={state.exerciseType === 'Gym' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Gym' })}>
            <FitnessCenterIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Other Activity">
          <IconButton color={state.exerciseType === 'Other' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Other' })}>
            <OtherIcon fontSize="large" /> 
          </IconButton>  
          </Tooltip>
        </div>
          <Form.Control 
            as="textarea"
            fontSize="large"
            rows={1}
            required 
            value={state.description} 
            onChange={(e) => setState({ ...state, description: e.target.value })}
          />
        <Form.Group controlId="formDate" className="form-margin">
          <Form.Label>Date:</Form.Label>
          <DatePicker 
            selected={state.date}
            onChange={(date) => setState({ ...state, date })}
            dateFormat="yyyy/MM/dd"
          />
        </Form.Group>
        <Form.Group controlId="duration" style={{ marginBottom: '40px' }}>
          <Form.Label>Duration (in minutes):</Form.Label>
          <Form.Control 
            type="number" 
            required 
            value={state.duration} 
            onChange={(e) => setState({ ...state, duration: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="distance" class={state.exerciseType === 'Gym' ? "invisible" : "default"} style={{ marginBottom: '40px' }}>
          <Form.Label>Distance (in kilometers):</Form.Label>
          <Form.Control 
            type="number"
            value={state.distance} 
            onChange={(e) => setState({ ...state, distance: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="speed" class={state.exerciseType === 'Gym' ? "invisible" : "default"} style={{ marginBottom: '40px' }}>
          <Form.Label>Speed (km/hr):</Form.Label>
          <Form.Control 
            type="number"
            value={calculateSpeed()} 
            onChange={(e) => setState({ ...state, speed: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="sets" class={state.exerciseType === 'Gym' ? "default" : "invisible"} style={{ marginBottom: '40px' }}>
          <Form.Label>Number of Sets:</Form.Label>
          <Form.Control 
            type="number"
            value={state.sets} 
            onChange={(e) => setState({ ...state, sets: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="reps" class={state.exerciseType === 'Gym' ? "default" : "invisible"} style={{ marginBottom: '40px' }}>
          <Form.Label>Number of Reps per set:</Form.Label>
          <Form.Control 
            type="number"
            value={state.reps} 
            onChange={(e) => setState({ ...state, reps: e.target.value })}
          />
        </Form.Group>
      <div style={{ marginBottom: '40px' }}>
        <p fontSize="medium" style={{ marginBottom: '10px' }}>How did it feel?</p>
        <Tooltip title="That felt good / easy - yay!">
          <IconButton color={state.mood === 'Happy' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Happy' })}>
            <HappyIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="That felt OK - could have been better!">
          <IconButton color={state.mood === 'Neutral' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Neutral' })}>
            <NeutralIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="That was difficult - glad it's over!">
          <IconButton color={state.mood === 'Difficult' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Difficult' })}>
            <UnhappyIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ouch - that was painful.">
          <IconButton color={state.mood === 'Painful' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Painful' })}>
            <PainfulIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="That was tiring - no energy.">
          <IconButton color={state.mood === 'Tiring' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Tiring' })}>
            <TiredIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </div>
      <Button variant="success" type="submit">
        Save activity
      </Button>
    </Form>
    {message && <p style={{color: 'green'}}>{message}</p>}
    </div>
  );
};

export default TrackExercise;
