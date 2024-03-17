import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col } from 'react-bootstrap';
import moment from 'moment';
import './journal.css';
import { useQuery, gql } from '@apollo/client';
import { BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, Label, Text} from 'recharts';

// import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
// import config from '../config';

console.log('on the journal graphQL page')
const weekly_goal = 280;

// // set up apollo client for graphql 
// const client = new ApolloClient({
//   uri: `${config.apiUrl}/api/graphql`,
//   cache: new InMemoryCache(),
// });

// setup schema query 
const JOURNAL_QUERY = gql
  `query weeklyStats($name: String, $start_date: String, $end_date: String) {
    weeklyStats(name: $name, start_date: $start_date, end_date: $end_date) {
      success
      errors
      results {
        username 
        exercises {
          exerciseType
          exerciseDuration
        }
      }
    }
  }
  `;

const DAILY_QUERY = gql
  `query dailyStats ($name: String, $start_date: String, $end_date: String){
    dailyStats(name: $name, start_date: $start_date, end_date: $end_date) {
      success
      errors
      results {
        username 
        totalDuration
        exerciseCount {
          date
          count
          dailyDuration
        }
      }
    }
  }
  `;

// default bar data - 0 exercises
const dailyExercise = [
  {day: 'M', id: '1', count: 0, duration: 0},
  {day: 'T', id: '2', count: 0, duration: 0},
  {day: 'W', id: '3', count: 0, duration: 0},
  {day: 'Th', id: '4', count: 0, duration: 0},
  {day: 'F', id: '5', count: 0, duration: 0},
  {day: 'S', id: '6', count: 0, duration: 0},
  {day: 'Su', id: '7', count: 0, duration: 0}
];


const Journal = ({ currentUser }) => {
  // isoWeek = start/end of ISO week = monday - sunday
  const [startDate, setStartDate] = useState(moment().startOf('isoWeek').toDate());
  const [endDate, setEndDate] = useState(moment().endOf('isoWeek').toDate());
  const [duration, setDuration] = useState({week_total: 0, percentage: 0});
  const [exerciseData, setExerciseDuration] = useState(dailyExercise);



  const { loading, error, data } = useQuery(DAILY_QUERY, {
    variables: {
      name: currentUser,
      start_date: moment(startDate).format('DD-MM-YYYY'),
      end_date: moment(endDate).format('DD-MM-YYYY'),
    },
  });

  useEffect(() => {
    if (data) {
      const exercises = data.dailyStats;
      updateExerciseStats(exercises);
    }
  }, [data, currentUser, startDate, endDate]);
  

  // handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // const exercises = data.weeklyStats;
  
  
  // // make graphql request
  // const fetchExercises = async() => {
  //   try {
  //     const response = await client.query({
  //       query: JOURNAL_QUERY,
  //       variables: {
  //         name: currentUser,
  //         start_date: moment(startDate).format('DD-MM-YYYY'),
  //         end_date: moment(endDate).format('DD-MM-YYYY'),
  //       },
  //     });
  //     setExercises(response.data.weeklyStats);
  //   } catch (error) {
  //     console.error('Failed to fetch exercises', error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchExercises();
  // }, [currentUser, startDate, endDate]);

  const goToPreviousWeek = () => {
    setStartDate(moment(startDate).subtract(1, 'weeks').startOf('isoWeek').toDate());
    setEndDate(moment(endDate).subtract(1, 'weeks').endOf('isoWeek').toDate());
  };

  const goToNextWeek = () => {
    setStartDate(moment(startDate).add(1, 'weeks').startOf('isoWeek').toDate());
    setEndDate(moment(endDate).add(1, 'weeks').endOf('isoWeek').toDate());
  };

  
  // generate exercise list - use of separate function call makes it easier to 
  // check if exercise results exist to avoid access errors
  // const makeExerciseList = () => {
  //   if (exercises.hasOwnProperty('results')) {
  //     return (exercises.success && exercises.results.length > 0) ? (
  //       exercises.results[0].exercises.map((item, index) => (
  //         <li key={index} className="exercise-journal-data">
  //           {item.exerciseType} - {item.exerciseDuration} minutes
  //         </li>
  //       ))
  //     ) : (
  //       <li>No exercises found for this period.</li>
  //     );
  //   } else {
  //     return <li>No exercises found for this period.</li>;
  //   }
  // };

 
  // Consolidating update functions
  const updateExerciseStats = (exercises) => {
    // check for results to confirm data is safe to access
    if (exercises.hasOwnProperty('results')){
      if (exercises.success && exercises.results.length > 0){
        updateExerciseCount(exercises);
        updateDuration(exercises);
      }
    }
  };

  const updateExerciseCount = (exercises) => {
      // Update dailyExercise count based on exerciseCount
      exercises.results[0].exerciseCount.forEach(({ count, date, dailyDuration }) => {
      const exercise = exerciseData.find(exercise => exercise.id === date);
      if (exercise) {
          exercise.count = count;
          exercise.duration = dailyDuration;
        }
      });
      // Update exerciseData state using the setter function
      setExerciseDuration([...dailyExercise]);
  };

  const updateDuration = (exercises) => {
    const totalDuration = data.dailyStats.results[0].totalDuration;
    // round down to closet integer  
    setDuration({ week_total: totalDuration , percentage: Math.floor((totalDuration / weekly_goal) * 100)});
  };

  console.log(exerciseData)
  

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
      <br></br>
        {/* <ul> {makeExerciseList()} </ul> */}
      <div className="exercise-bar-chart" style={{ height: "50vh" }}> {/* 50% of view height*/}
      <h4>Weekly Exercise Count</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={exerciseData}>
              <XAxis dataKey="day" />
              <YAxis interval={1} />
              <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <br></br>
      <div class="exercise-radial-bar" position="relative" style={{ width: "50%", height: "20vh" }}>
      <h5>Exercise Goal</h5>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          startAngle={90} 
          endAngle={-270} 
          innerRadius="80%" 
          outerRadius="100%" 
          barSize={10} 
          data={[duration]}
          >
          {/* Title */}
          <PolarAngleAxis
            type="number"
            domain={[0, weekly_goal]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            minAngle={15}
            background
            clockWise={true}
            dataKey="week_total"
            fill= "#8884d8"
          />
          {/* Label component for text */}
          <text
                x='50%'
                y='50%'
                style={{ fontSize: 20, fontWeight: 'bold' }}
                width={200}
                scaleToFit={true}
                textAnchor='middle'
                verticalAnchor='middle'
            >
                {`${duration['percentage']}%`}
            </text>
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
      </div>
    </div>
    
  );
};

export default Journal;