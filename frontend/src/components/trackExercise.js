import React, { useState } from 'react';
import { Button, Form, Col, Row, Dropdown, DropdownButton } from 'react-bootstrap';
import { Button, Form, Col, Row, Dropdown, DropdownButton } from 'react-bootstrap';
import { trackExercise } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import OtherIcon from '@mui/icons-material/HelpOutline';
import HappyIcon from '@mui/icons-material/SentimentVerySatisfied';
import PainfulIcon from "@mui/icons-material/MoodBad";
import UnhappyIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import NeutralIcon from "@mui/icons-material/SentimentSatisfied";
import TiredIcon from "@mui/icons-material/BatteryAlert";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TrackExercise = ({ currentUser }) => {
  const [state, setState] = useState({
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
  const [message, setMessage] = useState(''); 

  const calculateSpeed = () => {
    if (state.distance > 0) {
      state.speed = (state.distance / (state.duration / 60)).toFixed(2);
      return state.speed;
    } else {
      state.speed = 0;
      return state.speed;
    };
  };

  const calculatePace = () => {
    if (state.distance > 0) {
      state.pace = (state.duration / state.distance).toFixed(2);
      return state.pace;
    } else {
      state.pace = 0;
      return state.pace;
    };
  };

  const calculatePace = () => {
    if (state.distance > 0) {
      state.pace = (state.duration / state.distance).toFixed(2);
      return state.pace;
    } else {
      state.pace = 0;
      return state.pace;
    };
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
    };

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
    };

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
        <Row>
        <Row>
        <div style={{ marginBottom: '20px' }}>
          <Tooltip title="Running">
          <IconButton data-testid="Run Icon" color={state.exerciseType === 'Running' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Running' })}>
            <DirectionsRunIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Cycling">
          <IconButton color={state.exerciseType === 'Cycling' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Cycling' })}>
            <DirectionsBikeIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Swimming">
          <IconButton color={state.exerciseType === 'Swimming' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Swimming' })}>
            <PoolIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Workout">
          <IconButton data-testid="Gym Icon" color={state.exerciseType === 'Gym' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Gym' })}>
            <FitnessCenterIcon fontSize="large" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Other Activity">
          <IconButton color={state.exerciseType === 'Other' ? "primary" : "default"} onClick={() => setState({ ...state, exerciseType: 'Other' })}>
            <OtherIcon fontSize="large" /> 
          </IconButton>  
          </Tooltip>
        </div>
        </Row>
        <Row>
        </Row>
        <Row>
        <div id="div-other" className={state.exerciseType === 'Other' ? "div-other" : "invisible"}>            
          <Dropdown style={{ marginBottom: '40px' }}>
            <DropdownButton title="Which activity would you like to track?">
              <Dropdown.Item onClick={() => setState({ ...state, exerciseType: 'Rowing' })}>Rowing &#128675;</Dropdown.Item>
              <Dropdown.Item onClick={() => setState({ ...state, exerciseType: 'Football' })}>Football &#9917;</Dropdown.Item>
              <Dropdown.Item onClick={() => setState({ ...state, exerciseType: 'Skiing' })}>Skiing &#9975;</Dropdown.Item>
              <Dropdown.Item onClick={() => setState({ ...state, exerciseType: 'Golf' })}>Golf &#9971;</Dropdown.Item>
              <Dropdown.Item onClick={() => setState({ ...state, exerciseType: 'Horse Riding' })}>Horse Riding &#127943;</Dropdown.Item>
              <Dropdown.Item onClick={() => setState({ ...state, exerciseType: 'Climbing' })}>Climbing &#129495;</Dropdown.Item>
              <Dropdown.Item onClick={() => setState({ ...state, exerciseType: 'Surfing' })}>Surfing &#127940;</Dropdown.Item>
            </DropdownButton>
          </Dropdown>
        </div>
        </Row>
        <Row>
        </Row>
        <Row>
        <div id="other-label" className={state.exerciseType === 'Rowing' || state.exerciseType === 'Football' || state.exerciseType === 'Skiing' || state.exerciseType === 'Golf' || state.exerciseType === 'Horse Riding' || state.exerciseType === 'Climbing' || state.exerciseType === 'Surfing'? "other-label" : "invisible"}>
          <p id="other-exercise">Activity: {state.exerciseType}</p>
        </div>
        </Row>
        <Row>
          <Form.Group controlId="description" data-testid="title" style={{ marginBottom: '40px' }}>
        </Row>
        <Row>
          <Form.Group controlId="description" data-testid="title" style={{ marginBottom: '40px' }}>
          <Form.Label>Title your activity:</Form.Label>
          <Form.Control
            placeholder={state.exerciseType} 
          <Form.Control
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
          <Form.Group controlId="formDate" className="form-margin">
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId="formDate" className="form-margin">
          <Form.Label>Date:</Form.Label>
          <DatePicker 
            selected={state.date}
            onChange={(date) => setState({ ...state, date })}
            dateFormat="dd/MM/yyyy"
          />
          </Form.Group>
        </Row>
        <Row>
          <Col>
          </Row>
        <Row>
          <Col>
          <Form.Group controlId="duration" data-testid="duration" style={{ marginBottom: '40px' }}>
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
            </Col>
          <Col className={state.exerciseType === 'Gym' ? "invisible" : "col"}>
          <Form.Group controlId="distance" data-testid="distance" class={state.exerciseType === 'Gym' ? "invisible" : "col"} style={{ marginBottom: '40px' }}>
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
            </Col>
        </Row>
        <Row className={state.exerciseType === 'Gym' ? "invisible" : "row"}>
          <Col>
          <Tooltip title="Auto-calculated.">
            <Form.Group controlId="speed" data-testid="speed" class={state.exerciseType === 'Gym' ? "invisible" : "row"} style={{ marginBottom: '40px' }}>
              <Form.Label>Speed (km/hr):</Form.Label>
              <Form.Control 
                type="number"
                value={calculateSpeed()} 
                onChange={(e) => setState({ ...state, speed: e.target.value })}
              />
            </Form.Group>
            </Tooltip>
          </Col>
          <Col>
          <Tooltip title="Auto-calculated.">
          <Form.Group controlId="pace" data-testid="pace" className={state.exerciseType === 'Gym' ? "invisible" : "row"} style={{ marginBottom: '40px' }}>
            <Form.Label>Pace (min/km):</Form.Label>
            <Form.Control 
              type="number"
              value={calculatePace()} 
              onChange={(e) => setState({ ...state, pace: e.target.value })}
            />
          </Form.Group>
          </Tooltip>
          </Col>
        </Row>
        <Row className={state.exerciseType === 'Gym' ? "row" : "invisible"}>
          <Col>
            </Col>
          <Col>
          <Tooltip title="Auto-calculated.">
          <Form.Group controlId="pace" data-testid="pace" className={state.exerciseType === 'Gym' ? "invisible" : "row"} style={{ marginBottom: '40px' }}>
            <Form.Label>Pace (min/km):</Form.Label>
            <Form.Control 
              type="number"
              value={calculatePace()} 
              onChange={(e) => setState({ ...state, pace: e.target.value })}
            />
          </Form.Group>
          </Tooltip>
          </Col>
        </Row>
        <Row className={state.exerciseType === 'Gym' ? "row" : "invisible"}>
          <Col>
          <Form.Group controlId="sets" data-testid="sets" className={state.exerciseType === 'Gym' ? "row" : "invisible"} style={{ marginBottom: '40px' }}>
              <Form.Label>Number of Sets:</Form.Label>
              <Form.Control 
                type="number"
                value={state.sets} 
                onChange={(e) => setState({ ...state, sets: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col>
            </Col>
          <Col>
          <Form.Group controlId="reps" data-testid="reps" className={state.exerciseType === 'Gym' ? "row" : "invisible"} style={{ marginBottom: '40px' }}>
              <Form.Label>Number of Reps per set:</Form.Label>
              <Form.Control 
                type="number"
                value={state.reps} 
                onChange={(e) => setState({ ...state, reps: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
              </Col>
        </Row>
        <Row>
          <div style={{ marginBottom: '40px' }}>
                <p fontSize="medium" style={{ marginBottom: '10px' }}>How did it feel?</p>
                <Tooltip title="That felt good / easy - yay!">
                  <IconButton data-testid="Happy" color={state.mood === 'Happy' ? "primary" : "default"} onClick={() => setState({ ...state, mood: 'Happy' })}>
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
        </Row>
          </Row>
        <Button data-testid="submit btn" variant="success" type="submit">
            Save activity
          </Button>
        </Form>
        {message && <p style={message === 'Activity logged successfully! Well done!' ? message === 'Activity logged successfully! Well done!' ? {color: 'green'} : {color: 'red'}  : {color: 'red'} }>{message}</p>}
    </div>
  );
};

export default TrackExercise;
