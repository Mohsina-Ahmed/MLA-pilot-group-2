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
    goalValue: 0,
    caloriesGoal: 0,
    goalAim: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState('');

    useEffect(() => {
      console.log(`Fetching profile for ${currentUser}...`);
      fetchUserProfile();
      fetchUserGoals();
      // setUserAlert();
    }, [currentUser]);

    
    const setGoalType = (type) => {
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

  const setHeader = () => {
    if (goalData.exerciseType === '' || null) {
      const header = `Weekly Goals`;
      return header;
    } else {
      const header = `Weekly ${goalData.exerciseType} Goals`;
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
          setError('You have not set your goals. Select your preferred activity to do this.');
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
        setError(null); // Reseting error message to blank.
        // Updating information in auth service.
        const authResponse = await axios.post(`${config.apiUrl}/auth/profile`, userDataToSubmit);
        // Checking profile updated correctly.
        if (authResponse.data === 'User profile updated.') {
          setError(null); // Reseting error message to blank.
          console.log('User profile updated successfully.');

          // Updating goal data in activity tracking service.
          if (goalData.goalValue === 0) {
            console.log('No goal set by user.');

          } else if (!state && goalData.goalValue > 0) {
            const response = await axios.post(`${config.apiUrl}/goals/add`, goalDataToSubmit);
            console.log(response);
            setState(true);
            if (response.data.message === 'New goal saved!') {
              console.log('Goal saved successfully: ', response.data);
            } else {
              setMessage('An error occurred when adding your weekly goal. Please try again.');
              setTimeout(() => setMessage(''), 2000);
              return;
            }

          } else if (state && goalData.goalValue > 0) {
            const response = await axios.put(`${config.apiUrl}/goals/update/${goalData.username}`, goalDataToSubmit);
            console.log(response);
            if (response.data.message === 'Goal updated!') {
              console.log('Goal saved successfully: ', response.data);
            } else {
              setMessage('An error occurred when updating your weekly goal. Please try again.');
              setTimeout(() => setMessage(''), 2000);
              return;
            }
          }
          // Profile updated successfully.
          setError(null); // Reseting error message to blank.
          setMessage('Your profile has been updated successfully.');
          setTimeout(() => setMessage(''), 2000);

          // User profile not updated successfully, setting alert message.
        } else {
          console.log(authResponse.data);
          setError(authResponse.data);
        }
      } catch (error) {
        console.error('There was an error updating your profile', error);
        setError(error.response?.data);
        setMessage('An error occurred when updating your profile. Please try again.');
        setTimeout(() => setMessage(''), 2000);
        return;
      }
    };

  return (
    <div>
      {error && <Alert variant="danger" style={{ padding: "5px" }}>{error}</Alert>}
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
          <Form.Group aria-label="Your height in meters" controlId="height">
            <Form.Label>Height (in meters)</Form.Label>
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
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, exerciseType: 'Walking' })}>Walking</Dropdown.Item>
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

        <h3 style={{ marginTop: '40px' }} >Your Goals:</h3>
        <Row style={{ marginTop: '20px' }}>
          <Col style={{ width: '80%' }}>
          <p style={{ marginBottom: '20px' }} >What's your aim?</p>
          <div style={{ margin: 'auto' }}>
          <Dropdown>
            <DropdownButton aria-label="Your aim" title={goalData.goalAim ? goalData.goalAim : "Choose your aim"}>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, goalAim: 'Fitness' })}>Fitness</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, goalAim: 'Weight loss' })}>Weight loss</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, goalAim: 'Weight gain' })}>Weight gain</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, goalAim: 'Flexibility' })}>Flexibility</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, goalAim: 'Mobility' })}>Mobility</Dropdown.Item>
              <Dropdown.Item onClick={() => setGoalData({ ...goalData, goalAim: 'Body toning' })}>Body toning</Dropdown.Item>
            </DropdownButton>
          </Dropdown>
          </div>
          </Col>

          <Col style={{ width: '80%' }}>
          <p style={{ marginBottom: '20px' }} >{setHeader()}:</p>
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
        </Row>

        <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Col style={{ width: '80%' }}>
          <Form.Group aria-label="Daily calories goal" controlId="caloriesGoal" >
            <Form.Label>Daily Calories Goal</Form.Label>
            <Form.Control
              type="number" 
              name="caloriesGoal"
              value={goalData.caloriesGoal}
              onChange={(e) => setGoalData({ ...goalData, caloriesGoal: e.target.value })}
              required
            />
          </Form.Group>
          </Col>

          <Col style={{ width: '80%' }}>
          <Form.Group aria-label="Your weekly goal value" controlId="goalValue" >
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
      {message && <p style={ message === 'Your profile has been updated successfully.' ? {color: 'green'} : {color: 'red'} }>{message}</p>}
    </div>
  );
};

export default UserProfile;
