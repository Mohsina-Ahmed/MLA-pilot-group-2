import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = ({ onLogout }) => {
  const navigate = useNavigate();

  const onNavigate = (route) => {
    console.log('Navigating to:', route);  
    switch(route) {
      case 'TrackExercise':
        navigate('/trackExercise');
        break;
      case 'Statistics':
        navigate('/statistics');
        break;
      default:
        console.error('Invalid route:', route);
    }
  };

  return (
    <Navbar className="nav-back" expand="lg">
      {/* <Navbar.Brand href="#">CFG Fitness App</Navbar.Brand> */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        <Nav>
      <Nav.Link className="custom-nav-link" onClick={() => onNavigate('TrackExercise')}>Track New Exercise</Nav.Link>
      <Nav.Link className="custom-nav-link" onClick={() => onNavigate('Statistics')}>Statistics</Nav.Link>
      <Nav.Link className="custom-nav-link" onClick={() => onNavigate('GoalSetting')}>Goal Setting</Nav.Link>
      <Nav.Link className="custom-nav-link" onClick={onLogout}>Logout</Nav.Link>
        </Nav>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
