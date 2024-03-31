import React, { useState, useEffect } from 'react';
import { Form, Col, Row, Dropdown, DropdownButton, Alert, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../config';
import axios from 'axios';

const UserProfile = ({ currentUser }) => {
  const [state, setState] = useState(null);
  const [userData, setUserData] = useState({
    username: currentUser,
    firstName: '',
    surname: '',
    email: '',
    dob: '',
    height: 0,
    weight: 0
  });
  const [goalData, setGoalData] = useState({
    username: currentUser,
    exerciseType: '',
    goalType: '',
    goalUnit: '',
    goalValue: 0
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

    useEffect(() => {
      console.log(`Fetching profile for ${currentUser}...`);
      fetchUserProfile();
      fetchUserGoals();
      // setUserAlert();
    }, [currentUser]);

    
    const setGoalType = (type) => {
      console.log("Setting the goal type...")
      if (type === 'Duration') {
        setGoalData({ ...goalData, goalType: 'Duration', goalUnit: 'hours' });
      } else if (type === 'Distance') {
        setGoalData({ ...goalData, goalType: 'Distance', goalUnit: 'kilometers' });
      } else if (type === 'Sets') {
        setGoalData({ ...goalData, goalType: 'Sets', goalUnit: 'number of' });
      } else {
        goalData.goalUnit = '';
      }
  };

  //   const setUserAlert = () => {
      
  // };

  const setHeader = () => {
    if (goalData.exerciseType === '' || null) {
      const header = `Your Goals`;
      return header;
    } else {
      const header = `Your ${goalData.exerciseType} Goals`;
      return header;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/auth/profile/${currentUser}`);

      if (response.status === 200) {
        setUserData(response.data);
      } else {
        console.log('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    for (let param in userData) {
      if (param === '' || 0) {
        setError('You have not added all your personal information. Please complete your profile.')
        break;
      }};
  };

  const fetchUserGoals = async () => {
    try { 
      const response = await axios.get(`${config.apiUrl}/goals/${currentUser}`);

      if (response.status === 200) {
        if (response.data) {
          setState(true);
          setGoalData(response.data);
        } else {
          setState(false);
          setError('You have not set your weekly goal. Select your preferred activity to do this.');
          console.log("User has not set a goal yet.")
        }
      } else {
        console.log('Failed to fetch user goals.');
      }
    } catch (error) {
      console.error('Error fetching user goal:', error);
    }
  }

  const onSubmit = async (e) => {
      e.preventDefault();
      setError('');

      const userDataToSubmit = {
        username: currentUser,
        ...userData,
      };

      const goalDataToSubmit = {
        username: currentUser,
        ...goalData,
      };
  
      try {
        const authResponse = await axios.post(`${config.apiUrl}/auth/profile`, userDataToSubmit);
        console.log(`Auth api response: ${authResponse.data}`);
        if (goalData.duration === 0 && goalData.distance === 0) {
          console.log('No goal set by user, no request sent.')
        } else if (!state) {
          const addResponse = await axios.post(`${config.apiUrl}/goals/add`, goalDataToSubmit);
          console.log(`Goal added`);
          setState(true);
        } else if (state) {
          const updateResponse = await axios.put(`${config.apiUrl}/goals/update/${goalData.username}`, goalDataToSubmit);
          console.log(`Goal updated`);
        }

        setMessage(`Your profile has been updated successfully.`);
        setTimeout(() => setMessage(''), 2000);

      } catch (error) {
        console.error('There was an error updating your profile', error);
      }
    };

  return (
    <div>
      <Alert variant="danger" className={error ? 'default' : 'invisible'}>{error}</Alert>
      {userData && (
        
      <Form onSubmit={onSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
        
        <h3 aria-label="Your user profile">{userData.firstName}'s Profile</h3>

        <Row style={{ marginBottom: '20px' }}>
        <Col>
          <Form.Group aria-label="Your first name" controlId="firstName" >
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={userData.firstName}
              onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              required
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group aria-label="Your surname" controlId="surname">
            <Form.Label>Surname</Form.Label>
            <Form.Control
              type="text"
              name="surname"
              value={userData.surname}
              onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
              required
            />
          </Form.Group>
        </Col>
        </Row>

        <Row style={{ marginBottom: '20px' }}>
        <Col style={{ maxWidth: '70%' }} >
          <Form.Group aria-label="Your email address" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
          </Form.Group>
        </Col>

        <Col style={{ maxWidth: '30%' }} >
          <Form.Group aria-label="Your date of birth" controlId="dob">
            <Form.Label>Date of birth</Form.Label>
            <Form.Control
              type="text" // To be formatted as a date if there is time!!
              name="dob"
              value={userData.dob}
              onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
              required
            />
          </Form.Group>
        </Col>
        </Row>

        <Row style={{ marginBottom: '20px' }}>
        <Col>
          <Form.Group aria-label="Your height in metres" controlId="height">
            <Form.Label>Height (in metres)</Form.Label>
            <Form.Control
              type="number" 
              name="height"
              value={userData.height}
              onChange={(e) => setUserData({ ...userData, height: e.target.value })}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group aria-label="Your weight in kilograms" controlId="weight">
            <Form.Label>Weight (in kilograms)</Form.Label>
            <Form.Control
              type="number" 
              name="weight"
              value={userData.weight}
              onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
              required
            />
          </Form.Group>
        </Col>
        </Row>

        <div style={{ marginBottom: '20px' }}>
          <Dropdown>
            <DropdownButton aria-label="Your preferred activity" title={goalData.exerciseType ? `Preferred Activity: ${goalData.exerciseType}` : "Select your preferred activity"}>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Running' })}>Running</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Cycling' })}>Cycling</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Swimming' })}>Swimming</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Gym' })}>Gym</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Rowing' })}>Rowing</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Football' })}>Football</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Skiing' })}>Skiing</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Horse Riding' })}>Horse Riding</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Surfing' })}>Surfing</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Golf' })}>Golf</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Climbing' })}>Climbing</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Other' })}>Other</Dropdown.Item>
            </DropdownButton>
          </Dropdown>
        </div>
        
        <h3 style={{ marginTop: '40px' }} >{setHeader()}</h3>
        <p>Weekly Target:</p>

        <Row style={{ marginTop: '20px' }}>
        <Col>
        <div style={{ margin: 'auto' }}>
          <Dropdown>
            <DropdownButton aria-label="Weekly goal metric" title={goalData.goalType ? goalData.goalType : "Goal Metric"}>
              <Dropdown.Item aria-label="Duration" onClick={() => setGoalType("Duration")} >Duration</Dropdown.Item>
              <Dropdown.Item aria-label="Distance" onClick={() => setGoalType("Distance")} >Distance</Dropdown.Item>
              <Dropdown.Item aria-label="Sets" onClick={() => setGoalType("Sets")} >Sets</Dropdown.Item>
            </DropdownButton>
          </Dropdown>
        </div>
        </Col>

        <Col>
        <Form.Group aria-label="Your goal value" controlId="goalValue" >
          <Form.Label>Goal /{goalData.goalUnit}</Form.Label>
          <Form.Control
            type="number" 
            name="goalValue"
            value={goalData.goalValue}
            onChange={(e) => setGoalData({ ...goalData, goalValue: e.target.value })}
            required
          />
        </Form.Group>
        </Col>
        </Row>

        <Button aria-label="Update profile" variant="primary" type="submit" style={{ marginTop: '20px' }}>
          Update Profile
        </Button>
      </Form>
      )}
      {message && <p style={ {color: 'green'} }>{message}</p>}
    </div>
  );
};

export default UserProfile;
