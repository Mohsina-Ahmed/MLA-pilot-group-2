import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import './journal.css';
import { useQuery, NetworkStatus } from '@apollo/client';
import { BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell} from 'recharts';

import { EXERCISE_QUERY } from './queries/graphql';


const duration_goal = 280;
const distance_goal = 50;

// default bar data - 0 exercises
const zeroExerciseList = () => {
    return [
    {day: 'M', id: '1', count: 0, duration: 0},
    {day: 'T', id: '2', count: 0, duration: 0},
    {day: 'W', id: '3', count: 0, duration: 0},
    {day: 'Th', id: '4', count: 0, duration: 0},
    {day: 'F', id: '5', count: 0, duration: 0},
    {day: 'S', id: '6', count: 0, duration: 0},
    {day: 'Su', id: '7', count: 0, duration: 0}
  ];
};

const weeklygoalList = () => {
  return {week_total: 0, percentage: 0}
}


const Journal = ({ currentUser }) => {
  // isoWeek = start/end of ISO week = monday - sunday
  const [startDate, setStartDate] = useState(moment().startOf('isoWeek').toDate());
  const [endDate, setEndDate] = useState(moment().endOf('isoWeek').toDate());
  const [duration, setDuration] = useState(weeklygoalList());
  const [distance, setDistance] = useState(weeklygoalList());
  const [exerciseData, setExerciseDuration] = useState(zeroExerciseList());


  const { loading, error, data, refetch, networkStatus } = useQuery(EXERCISE_QUERY, {
    variables: {
      name: currentUser,
      start_date: moment(startDate).format('DD-MM-YYYY'),
      end_date: moment(endDate).format('DD-MM-YYYY'),
    },
    notifyOnNetworkStatusChange: true,
    // fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    // function for exercise count
    const updateExerciseCount = (exercises) => {
      // Update dailyExercise count based on exerciseCount
      const exerciseList = zeroExerciseList() 
      exercises.results[0].exerciseCount.forEach(({ count, date, dailyDuration }) => {
      const exercise = exerciseList.find(exercise => exercise.id === date);
      if (exercise) {
          exercise.count = count;
          exercise.duration = dailyDuration;
        }
      });
      // Update exerciseData state using the setter function
      setExerciseDuration([...exerciseList]);
    };

    // function for duration
    const updateGoals = (exercises) => {
      // round down to closet integer  
      const totalDuration = exercises.results[0].totalDuration;
      const totalDistance = exercises.results[0].totalDistance;
      const durationPerc= Math.floor((totalDuration / duration_goal) * 100)
      const distancePerc= Math.floor((totalDistance / distance_goal) * 100)
      setDuration({ week_total: totalDuration , percentage: (durationPerc < 100) ? durationPerc : 100});
      setDistance({ week_total: totalDistance , percentage: (distancePerc < 100) ? distancePerc : 100});
    };

    // check for data object
    if (data) {
      const exercises = data.exerciseStats;

      // check for results in graphql response
      if (exercises.hasOwnProperty('results')){
        if (exercises.success && exercises.results.length > 0){
          updateExerciseCount(exercises);
          updateGoals(exercises);
        }
        else {
          // no data present - reset to 0 
          setExerciseDuration(zeroExerciseList());
          setDuration(weeklygoalList())
          setDistance(weeklygoalList())
        }
      }
    }
  }, [data, currentUser, startDate, endDate]);
  
  // handle loading and error states
  if (loading || networkStatus === NetworkStatus.refetch) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
    
  // Handle date buttons
  const today = moment();
  const isNextWeekValid = moment(startDate).add(1, 'weeks').isBefore(today);

  const goToPreviousWeek = () => {
    setStartDate(moment(startDate).subtract(1, 'weeks').startOf('isoWeek').toDate());
    setEndDate(moment(endDate).subtract(1, 'weeks').endOf('isoWeek').toDate());
  };

  const goToNextWeek = () => {
    setStartDate(moment(startDate).add(1, 'weeks').startOf('isoWeek').toDate());
    setEndDate(moment(endDate).add(1, 'weeks').endOf('isoWeek').toDate());
  };


  return (
    <div className="journal-container">
      <h4>Weekly Exercise Journal</h4>
      <br></br>
      <div className="date-range">
        <Button className="button-small" onClick={goToPreviousWeek}>&larr; Previous</Button>
        <span>{moment(startDate).format('DD-MM-YYYY')} to {moment(endDate).format('DD-MM-YYYY')}</span>
        {isNextWeekValid && <Button className="button-small" onClick={goToNextWeek}>Next &rarr;</Button>}
      </div> 
        {/* <ul> {makeExerciseList()} </ul> */}
      <div className="two-column-layout">   
        <div class="exercise-radial-bar">
        <text>Duration</text>
        <ResponsiveContainer>
          <RadialBarChart 
            startAngle={90} // adjust start/end angle to make rotate clockwise
            endAngle={-270} 
            innerRadius={60} 
            outerRadius={80} 
            barSize={15} 
            data={[duration]}
            >
            {/* Title */}
            <PolarAngleAxis
              type="number"
              domain={[0, duration_goal]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={5}
              background
              clockWise={true}
              cornerRadius={10 / 2}
              dataKey="week_total"
            >
                <Cell
                  key={`cell-1`}
                  fill={duration['percentage'] === 100 ? "#49ff8f" : "#8884d8"} // adjust colour for 100% goal
                />
            </RadialBar>
            {/* Label component for text */}
            <text x='50%' y='50%' textAnchor='middle' style={{ fontSize: 20, fontWeight: 'bold', dominantBaseline:'middle' }}>
                  {`${duration['percentage']}%`}
            </text>
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
        </div>
        <div className="exercise-radial-bar">
          <text>Distance</text>
          <ResponsiveContainer>
            <RadialBarChart 
              startAngle={90} // adjust start/end angle to make rotate clockwise
              endAngle={-270} 
              innerRadius={60} 
              outerRadius={80} 
              barSize={15} 
              data={[distance]}
              >
              {/* Title */}
              <PolarAngleAxis
                type="number"
                domain={[0, distance_goal]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                minAngle={5}
                background
                clockWise={true}
                cornerRadius={10 / 2}
                dataKey="week_total"
              >
                  <Cell
                    key={`cell-1`}
                    fill={distance['percentage'] === 100 ? "#49ff8f" : "#8884d8"} // adjust colour for 100% goal
                  />
              </RadialBar>
              {/* Label component for text */}
              <text x='50%'y='50%' textAnchor='middle' style={{ fontSize: 20, fontWeight: 'bold', dominantBaseline:'middle' }}>
                    {`${distance['percentage']}%`}
              </text>
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>  
        </div>
      </div>

      <br></br>
      <div className="exercise-bar-chart"> 
      <h5>Daily Exercise</h5>
        <ResponsiveContainer>
          <BarChart data={exerciseData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} domain={[0, dataMax => (dataMax === 0 ? dataMax + 1 : dataMax)]}/>  {/*set Yaxis limits*/}
              <Tooltip />
            <Bar dataKey="count" fill="#8884d8"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
  );
};

export default Journal;