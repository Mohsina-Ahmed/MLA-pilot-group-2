import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('');

  const onNavigate = (route) => {
    console.log('Navigating to:', route);  
    setActiveLink(route); // Set the active link when clicked
    switch(route) {
      case 'Homepage':
        navigate('/homepage');
        break;
      case 'TrackExercise':
        navigate('/trackExercise');
        break;
      case 'Statistics':
        navigate('/statistics_v2');
        break;
      case 'Journal':
        navigate('/journal_v2');
        break;
      default:
        console.error('Invalid route:', route);
    }
  };

  return (
    <Navbar className="nav-back custom-navbar" expand="lg" activeKey=""> 
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className={`custom-nav-link ${activeLink === 'Homepage' ? 'active' : ''}`} onClick={() => onNavigate('Homepage')}>Homepage</Nav.Link>
          <Nav.Link className={`custom-nav-link ${activeLink === 'TrackExercise' ? 'active' : ''}`} onClick={() => onNavigate('TrackExercise')}>Track New Exercise</Nav.Link>
          <Nav.Link className={`custom-nav-link ${activeLink === 'Statistics' ? 'active' : ''}`} onClick={() => onNavigate('Statistics')}>Statistics</Nav.Link>
          <Nav.Link className={`custom-nav-link ${activeLink === 'Journal' ? 'active' : ''}`} onClick={() => onNavigate('Journal')}>Weekly Journal</Nav.Link>
          <Nav.Link className="custom-nav-link" onClick={onLogout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;