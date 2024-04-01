import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import moment from 'moment';
import './statistics.css';
import { useQuery, NetworkStatus } from '@apollo/client';
import { STATS_QUERY, STATS_ACTIVITY_QUERY } from './queries/graphql';



const Statistics = ({currentUser}) => {
  const [data, setData] = useState([]);
  const [currentActivity, setCurrentActivity] = useState({activity: "Running"});  // set default as first activity - GOAL: default to preferred user activity from profile

  const statsResponse = useQuery(STATS_ACTIVITY_QUERY, {variables: {name: currentUser, activity: currentActivity.activity}})

  // make graphql request
  useEffect(() => {
    if (statsResponse.data) {
      const statsResults = statsResponse.data.filteredActivityStats;
      
      if (statsResults.success && statsResults.results.length > 0){
        const statsData = statsResults.results[0]
        setData(statsData);
      }
      else {
        setData([])
      }
    }

  }, [setCurrentActivity, statsResponse, currentUser]);

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
                <Dropdown.Item onClick={() => setCurrentActivity({ activity: 'Walking' })}>Walking</Dropdown.Item>
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
      return (Object.keys(data).length > 0) ? (     
          <div className="stats-list">     
            <li key={0} className="exercise-data">
              <div>Activities logged: {data.totalActivities}</div>
            </li>
            <li key={1} className="exercise-data">
              <div><strong>{data.exercise}</strong></div>
              <div className="two-column-layout">
                <div>Total Duration: {data.totalDuration} min</div>
                <div>Total Distance: {data.totalDistance} km</div>
              </div>
            </li>
            <h6 style={{margin: "10px"}}>Personal Records</h6>
            <div className="two-column-layout">
              <div className="stats-list-container">
                <li key={0}>Time: {data.longestDuration} min</li>
                <li key={1}>Distance: {data.longestDistance} km</li>
              </div>
              <div className="stats-list-container">
                <li key={2}>Pace: {data.fastestPace} min/km</li> 
                <li key={3}>Goal Streak: -</li>
              </div>
            </div>
          </div>
      ) : (
        <li>No data available - Time to get active!</li>
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