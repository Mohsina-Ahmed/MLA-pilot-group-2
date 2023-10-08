import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { createUser } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState(''); 

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await createUser({ username });
        console.log('User added successfully:', username, response.data);
        setMessage('User created successfully!');
        setTimeout(() => setMessage(''), 2000);
    } catch (error) {
        console.error('There was an error adding the user!', error);
    }

    setUsername('');
  };

  return (
    <div>
      <h3>Create New User</h3>
      <Form onSubmit={onSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
        <Form.Group controlId="username" className="form-margin">
          <Form.Label>Username:</Form.Label>
          <Form.Control 
            type="text" 
            required 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
      {message && <p style={{color: 'green', marginTop: '20px'}}>{message}</p>}
    </div>
  );
};

export default CreateUser;
