import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import './statistics.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import config from '../config';

console.log('on the statistics graphQL page')

// setup the apollo client for graphql 
const client = new ApolloClient({
  uri: `${config.apiUrl}/api/graphql`,
  cache: new InMemoryCache(),
});

console.log(`${config.apiUrl}/api/graphql`)

// setup the graphql query 
const STATS_QUERY = gql
  `query filteredStats($name: String) {
    filteredStats(name: $name) {
      success
      errors
      results {
        username 
        exercises {
          exerciseType
          totalDuration
        }
      }
    }
  }
  `;

const Statistics = ({currentUser}) => {
  const [data, setData] = useState([]);

  // make graphql request
  useEffect(() => {
    // const url = 'http://localhost:5050/api/graphql';
    client.query({query: STATS_QUERY, variables: {name: currentUser}})
      .then(response => {setData(response.data.filteredStats)})
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [currentUser]);

  // generate exercise list - use of separate function call makes it easier to 
  // check if exercise results exist to avoid access errors
  const makeStatsList = () => {
    if (data.hasOwnProperty('results')) {
      return (data.success && data.results.length > 0) ? (
        data.results[0].exercises.map((item, index) => (
          <div key={index} className="exercise-data">
            <div><strong>{item.exerciseType}</strong></div>
            <div>Total Duration: {item.totalDuration} min</div>
          </div>
        ))
      ) : (
        <li>No data available.</li>
      );
    } else {
      return <li>No data available.</li>;
    }
  }

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
      <ul> {makeStatsList()} </ul>
    </div>
  );
};

export default Statistics;