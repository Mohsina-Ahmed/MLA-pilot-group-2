import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { trackExercise } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@material-ui/core/IconButton';
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
    date: new Date(),
    mood: '',
  });
  const [message, setMessage] = useState(''); 

// Attempt to listen to icon choice to adapt a title prompt.
//  const runIcon = document.getElementById("run");
//  runIcon.addEventListener('click', onActivityChoice)

//  const onActivityChoice = () => {
//    console.log("Run button clicked!")  
//  };

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
          <IconButton color={state.exerciseType === 'Running' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Running' })}>
            <DirectionsRunIcon fontSize="large" />
          </IconButton>
          <IconButton color={state.exerciseType === 'Cycling' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Cycling' })}>
            <BikeIcon fontSize="large" />
          </IconButton>
          <IconButton color={state.exerciseType === 'Swimming' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Swimming' })}>
            <PoolIcon fontSize="large" />
          </IconButton>
          <IconButton color={state.exerciseType === 'Gym' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Gym' })}>
            <FitnessCenterIcon fontSize="large" />
          </IconButton>
          <IconButton color={state.exerciseType === 'Other' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Other' })}>
            <OtherIcon fontSize="large" /> 
          </IconButton>  
        </div>
          <Form.Control 
            as="textarea"
            fontSize="large"
            rows={1}
            required 
            value={state.description} 
            onChange={(e) => setState({ ...state, description: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formDate" className="form-margin">
          <Form.Label>Date:</Form.Label>
          <DatePicker 
            selected={state.date}
            onChange={(date) => setState({ ...state, date })}
            dateFormat="yyyy/MM/dd"
          />
        </Form.Group>
        <Form.Group controlId="duration" style={{ maxWidth: '50px', marginBottom: '40px' }}>
          <Form.Label>Duration (in minutes):</Form.Label>
          <Form.Control 
            type="number" 
            required 
            value={state.duration} 
            onChange={(e) => setState({ ...state, duration: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="distance" style={{ maxWidth: '50px', marginBottom: '40px' }}>
          <Form.Label>Distance (in kilometers):</Form.Label>
          <Form.Control 
            type="number"
            value={state.distance} 
            onChange={(e) => setState({ ...state, distance: e.target.value })}
          />
        </Form.Group>
      <div style={{ marginBottom: '40px' }}>
        <p fontSize="medium" style={{ marginBottom: '10px' }}>How did it feel?</p>
        <IconButton color={state.mood === 'Happy' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Happy' })}>
          <HappyIcon fontSize="large" />
        </IconButton>
        <IconButton color={state.mood === 'Neutral' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Neutral' })}>
          <NeutralIcon fontSize="large" />
        </IconButton>
        <IconButton color={state.mood === 'Difficult' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Difficult' })}>
          <UnhappyIcon fontSize="large" />
        </IconButton>
        <IconButton color={state.mood === 'Painful' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Painful' })}>
          <PainfulIcon fontSize="large" />
        </IconButton>
        <IconButton color={state.mood === 'Tiring' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Tiring' })}>
          <TiredIcon fontSize="large" />
        </IconButton>
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
