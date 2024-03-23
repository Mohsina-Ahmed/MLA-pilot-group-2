import React, { useState } from 'react';
import { Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '',
    firstName: '',
    surname: '',
    email: '',
    dob: '',
    height: '',
    weight: '' 
  });
  const [error, setError] = useState('');

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
};

const handleSignup = async (e) => {
  e.preventDefault();
  setError('');

    try {
        
        const response = await axios.post(`${config.apiUrl}/auth/signup`, formData);

        if (response.data === 'User registered successfully!') {
            console.log('User registered successfully');
            onSignup(formData.username); 
        } else {
            setError(response.data);
        }
    } catch (error) {
        console.error('Error during registration', error);
        setError(error.response?.data || 'An error occurred during registration. Please try again.');
    }
  };


  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSignup} >
        <Row style={{ marginBottom: '20px' }}>
        <Col>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        </Col>   
        </Row>
        <Row style={{ marginBottom: '20px' }}>
        <Col>
        <Form.Group controlId="name">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="surname">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter surname"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        </Col>
        </Row>
        <Row style={{ marginBottom: '20px' }} >
        <Col style={{ maxWidth: '75%' }} >
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        </Col>
        <Col style={{ maxWidth: '25%' }} >
        <Form.Group controlId="dob">
          <Form.Label>Date of birth</Form.Label>
          <Form.Control
            type="text"
            placeholder="DD/MM/YYYY"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        </Col>
        </Row>
        <Row style={{ marginBottom: '20px' }}>     
        <Col>
        <Form.Group controlId="height">
          <Form.Label>Height ( in meters)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter current height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId="weight">
          <Form.Label>Weight (in kilograms)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter current weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        </Col>
        </Row>

        <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
          Signup
        </Button>
      </Form>
      <p className="mt-3">
    Already have an account? <Link to="/login">Login</Link>
</p>
    </div>
  );
};

export default Signup;