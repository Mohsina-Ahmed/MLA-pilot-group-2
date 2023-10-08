import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Navbar, Nav, Container } from 'react-bootstrap'; // Not needed as you have NavbarComponent
import CreateUser from './components/createUser';
import TrackExercise from './components/trackExercise';
import React, { useState, useEffect } from 'react';
import Footer from './components/footer';
// import Login from './components/login'; 
import NavbarComponent from './components/navbar';
import Statistics from './components/statistics';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [activeWindow, setActiveWindow] = useState('TrackExercise'); 

  const handleNavigation = (window) => {
    setActiveWindow(window);
  };

  // if (!isLoggedIn) {
  //   return <Login onLogin={() => setIsLoggedIn(true)} />;
  // }

  return (
    <div className="App">
      <div className="appTitle">
        <h1>CFG Fitness App</h1>
      </div>

      {/* Your NavbarComponent goes here */}
      <NavbarComponent onNavigate={handleNavigation} />

      <div className="componentContainer">
        {activeWindow === 'TrackExercise' && <TrackExercise />}
        {activeWindow === 'Statistics' && <Statistics />} 
        {/* {activeWindow === 'GoalSetting' && <GoalSetting />} */}
      </div>
      <Footer />
    </div>
  );
}

export default App;
