import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import './statistics.css';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

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
    // axios.post(url, {query: STATS_QUERY, variables: {name: currentUser}})
    client.query({query: STATS_QUERY, variables: {name: currentUser}})
      .then(response => {
        setData(response.data.filteredStats);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, [currentUser]);

  // const fetchStats = async () => {
  //   try {
  //     const url = `http://localhost:5050/api/graphql`;
  //     const response = await axios.post(url, {query: STATS_QUERY, variables: {name: currentUser}});
  //     console.log('API Response:', response.data.data);
  //     if (response.data.data.filteredStats.success) {
  //       setData(response.data.data.filteredStats);
  //     } else {
  //       console.error('There was an error fetching the data: ', response.data.data.filteredStats.errors);
  //       setData([]);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch exercises', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchStats();
  // }, [currentUser]);

  console.log(data);

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
      {data.success? (
        data.results[0].exercises.map((item, index) => (
          <div key={index} className="exercise-data">
            <div><strong>{item.exerciseType}</strong></div>
            <div>Total Duration: {item.totalDuration} min</div>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Statistics;