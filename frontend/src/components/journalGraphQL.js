import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import './journal.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

console.log('on the journal graphQL page')

const client = new ApolloClient({
  uri: 'http://localhost:5050/api/graphql',
  cache: new InMemoryCache(),
});

const JOURNAL_QUERY = gql
  `query weeklyStats($name: String, $start_date: String, $end_date: String) {
    weeklyStats(name: $name, start_date: $start_date, end_date: $end_date) {
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


const Journal = ({ currentUser }) => {
  const [startDate, setStartDate] = useState(moment().startOf('week').toDate());
  const [endDate, setEndDate] = useState(moment().endOf('week').toDate());
  const [exercises, setExercises] = useState([]);

  // const fetchExercises = async () => {
  //   try {
  //     const url = `http://localhost:5050/stats/weekly/?user=${currentUser}&start=${moment(startDate).format('DD-MM-YYYY')}&end=${moment(endDate).format('DD-MM-YYYY')}`;
  //     const response = await axios.get(url);
  //     console.log('API Response:', response.data);
  //     if (response.data.stats && Array.isArray(response.data.stats)) {
  //       setExercises(response.data.stats);
  //     } else {
  //       console.error('Unexpected response structure:', response.data);
  //       setExercises([]);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch exercises', error);
  //   }
  // };

  console.log('I am here')
  const fetchExercises = async () => {
    try {
      // const url = `http://localhost:5050/stats/weekly/?user=${currentUser}&start=${moment(startDate).format('DD-MM-YYYY')}&end=${moment(endDate).format('DD-MM-YYYY')}`;
      client.query({query: JOURNAL_QUERY, variables: 
                      {name: currentUser, 
                        start_date: moment(startDate).format('DD-MM-YYYY'), 
                        end_date: moment(endDate).format('DD-MM-YYYY')}})
                        .then((response) => setExercises(response.data.weeklyStats))
                        .catch(error => {
                          console.error('There was an error fetching the data!', error);
                        }, setExercises([]))

      // if (response.data.stats && Array.isArray(response.data.stats)) {
      //   setExercises(response.data.stats);
      // } else {
      //   console.error('Unexpected response structure:', response.data);
      //   setExercises([]);
      // }
    } catch (error) {
      console.error('Failed to fetch exercises', error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [currentUser, startDate, endDate]);

  const goToPreviousWeek = () => {
    setStartDate(moment(startDate).subtract(1, 'weeks').startOf('week').toDate());
    setEndDate(moment(endDate).subtract(1, 'weeks').endOf('week').toDate());
  };

  const goToNextWeek = () => {
    setStartDate(moment(startDate).add(1, 'weeks').startOf('week').toDate());
    setEndDate(moment(endDate).add(1, 'weeks').endOf('week').toDate());
  };

  // TODO: Deal with empty result
  return (
    <div className="journal-container">
      <h4>Weekly Exercise Journal</h4>
      <br></br>
      <div className="date-range">
        <Button className="button-small" onClick={goToPreviousWeek}>&larr; Previous</Button>
        <span>{moment(startDate).format('DD-MM-YYYY')} to {moment(endDate).format('DD-MM-YYYY')}</span>
        <Button className="button-small" onClick={goToNextWeek}>Next &rarr;</Button>
        </div>
      <ul>
        {exercises.success ? (
          exercises.results[0].exercises.map((item, index) => (
            <li key={index} className="exercise-journal-data">
              {item.exerciseType} - {item.totalDuration} minutes
            </li>
          ))
        ) : (
          <li>No exercises found for this period.</li>
        )}
      </ul>
    </div>
  );
};

export default Journal;