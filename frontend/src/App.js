import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './components/navbar';
import TrackExercise from './components/trackExercise';
import Statistics from './components/statistics_v2';
import Footer from './components/footer';
import Login from './components/login';
import Signup from './components/signup';
import Journal from './components/journal_v2';
import Homepage from './components/homepage';
import logo from './img/CFG_logo.png'; // Update the path to your logo file

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(''); 

  const handleLogout = () => {
    setIsLoggedIn(false); 
    setCurrentUser(''); 
  };

  const handleLogin = (username) => { 
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  return (
    <div className="App">
      <Router>
        <div className="appTitle">
          <h1>MLA Fitness App Group 2 Welcome</h1>
          <img src={logo} alt="CFG Fitness App Logo" id="appLogo" />
        </div>

        {isLoggedIn && <NavbarComponent onLogout={handleLogout} />}

        <div className="componentContainer">
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup onSignup={(username) => {
              setIsLoggedIn(true);
              setCurrentUser(username);
            }} />} />
            <Route path="/homepage" element={isLoggedIn ? <Homepage currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/trackExercise" element={isLoggedIn ? <TrackExercise currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/statistics_v2" element={isLoggedIn ? <Statistics currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/journal_v2" element={isLoggedIn ? <Journal currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/" element={isLoggedIn ? <Navigate to="/homepage" /> : <Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
