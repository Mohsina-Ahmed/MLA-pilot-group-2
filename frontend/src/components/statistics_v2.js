import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import './statistics.css';
import { useQuery, NetworkStatus } from '@apollo/client';
import { STATS_QUERY } from './queries/graphql';



const Statistics = ({currentUser}) => {
  const [data, setData] = useState([]);

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
      

  // generate exercise list - use of separate function call makes it easier to 
  // check if exercise results exist to avoid access errors
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
      <ul> {makeStatsList()} </ul>
    </div>
  );
};

export default Statistics;