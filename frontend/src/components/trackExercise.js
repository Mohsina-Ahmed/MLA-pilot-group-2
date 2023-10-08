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

const TrackExercise = () => {
  const [state, setState] = useState({
    username: '',
    exerciseType: '',
    description: '',
    duration: 0,
    date: new Date(),
  });
  const [message, setMessage] = useState(''); 

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await trackExercise(state);
      console.log(response.data);

      setState({
        username: '',
        exerciseType: '',
        description: '',
        duration: 0,
        date: new Date(),
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
        <Form.Group controlId="username" className="form-margin">
          <Form.Label>Username:</Form.Label>
          <Form.Control 
            type="text" 
            required 
            value={state.username} 
            onChange={(e) => setState({ ...state, username: e.target.value })}
          />
        </Form.Group>
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
        <Form.Group controlId="description" style={{ marginBottom: '20px' }}>
          <Form.Label>Description:</Form.Label>
          <Form.Control 
            as="textarea"
            rows={3}
            required 
            value={state.description} 
            onChange={(e) => setState({ ...state, description: e.target.value })}
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
        <Button variant="success" type="submit">
          Save activity
        </Button>
      </Form>
      {message && <p style={{color: 'green'}}>{message}</p>}
    </div>
  );
};

export default TrackExercise;
