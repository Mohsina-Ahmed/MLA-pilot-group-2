import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import './statistics.css';
import { useQuery, NetworkStatus } from '@apollo/client';
import { STATS_QUERY, GOAL_QUERY } from './queries/graphql';



const Statistics = ({currentUser}) => {
  const [data, setData] = useState([]);
  const [currentActivity, setCurrentActivity] = useState({activity: "Running"});  // set default as first activity - GOAL: default to preferred user activity from profile

  const statsResponse = useQuery(STATS_QUERY, {variables: {name: currentUser}})



  // make graphql request
  useEffect(() => {
    if (statsResponse.data) {
      const statsResults = statsResponse.data.filteredStats;
      
      if (statsResults.success && statsResults.results.length > 0){
        const statsData = statsResults.results[0].exercises
        setData(statsData);
      }
    }

  }, [statsResponse, currentUser]);

    // handle loading and error states
    if (statsResponse.loading) return <p>Loading...</p>;
    if (statsResponse.error) return <p>Error: {statsResponse.error.message}</p>;
      

 
  const makeDropdownList = () => {
    return  <Dropdown>
              <DropdownButton aria-label="Your selected activity" title={`Activity: ${currentActivity.activity}`}>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Running' })}>Running</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Cycling' })}>Cycling</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Swimming' })}>Swimming</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Gym' })}>Gym</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Rowing' })}>Rowing</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Football' })}>Football</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Skiing' })}>Skiing</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Horse Riding' })}>Horse Riding</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Surfing' })}>Surfing</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Golf' })}>Golf</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Climbing' })}>Climbing</Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Other' })}>Other</Dropdown.Item>
              </DropdownButton>
            </Dropdown>
  } 

  const makeStatsList = () => {
      return (data.length > 0) ? (
        Object.values(data).map((item, index) => (
          <li key={index} className="exercise-data">
            <div><strong>{item.exerciseType}</strong></div>
            <div>Total Duration: {item.exerciseDuration} min</div>
          </li>
        ))
      ) : (
        <li>No data available.</li>
      );
  }

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}> 
        {makeDropdownList()} 
      </div>
      <ul> {makeStatsList()} </ul>
    </div>
  );
};

export default Statistics;