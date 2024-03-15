import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import './journal.css';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import config from '../config';

console.log('on the journal graphQL page')

// set up apollo client for graphql 
const client = new ApolloClient({
  uri: `${config.apiUrl}/api/graphql`,
  cache: new InMemoryCache(),
});

// setup schema query 
const JOURNAL_QUERY = gql
  `query weeklyStats($name: String, $start_date: String, $end_date: String) {
    weeklyStats(name: $name, start_date: $start_date, end_date: $end_date) {
      success
      errors
      results {
        username 
        totalDuration
        exercises {
          exerciseType
          exerciseDuration
        }
      }
    }
  }
  `;

const Journal = ({ currentUser }) => {
  const [startDate, setStartDate] = useState(moment().startOf('week').toDate());
  const [endDate, setEndDate] = useState(moment().endOf('week').toDate());
  const [exercises, setExercises] = useState([]);

  // make graphql request
  const fetchExercises = async() => {
    try {
      const response = await client.query({
        query: JOURNAL_QUERY,
        variables: {
          name: currentUser,
          start_date: moment(startDate).format('DD-MM-YYYY'),
          end_date: moment(endDate).format('DD-MM-YYYY'),
        },
      });
      setExercises(response.data.weeklyStats);
    } catch (error) {
      console.error('Failed to fetch exercises', error.message);
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

  
  // generate exercise list - use of separate function call makes it easier to 
  // check if exercise results exist to avoid access errors
  const makeExerciseList = () => {
    if (exercises.hasOwnProperty('results')) {
      return (exercises.success && exercises.results.length > 0) ? (
        exercises.results[0].exercises.map((item, index) => (
          <li key={index} className="exercise-journal-data">
            {item.exerciseType} - {item.exerciseDuration} minutes
          </li>
        ))
      ) : (
        <li>No exercises found for this period.</li>
      );
    } else {
      return <li>No exercises found for this period.</li>;
    }
  };

  //   <ul>
  //   {exercises.success ? (
  //     exercises.results[0].exercises.map((item, index) => (
  //       <li key={index} className="exercise-journal-data">
  //         {item.exerciseType} - {item.totalDuration} minutes
  //       </li>
  //     ))
  //   ) : 
  //     <li>No exercises found for this period.</li>
  //   }
  // </ul>

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
        <ul> {makeExerciseList()} </ul>
    </div>
  );
};

export default Journal;