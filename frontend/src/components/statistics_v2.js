import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import './statistics.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

console.log('on the statistics graphQL page')

const client = new ApolloClient({
  uri: 'http://localhost:5050/api/graphql',
  cache: new InMemoryCache(),
});

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

  useEffect(() => {
    // const url = 'http://localhost:5050/api/graphql';
    client.query({query: STATS_QUERY, variables: {name: currentUser}})
      .then(response => {setData(response.data.filteredStats)})
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [currentUser]);

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