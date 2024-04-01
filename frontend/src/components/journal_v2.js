import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import './journal.css';
import { useQuery, NetworkStatus } from '@apollo/client';
import { BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell} from 'recharts';

import { EXERCISE_QUERY, GOAL_QUERY } from './queries/graphql';

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

const weeklygoalData = () => {
  return {exercise: 0, percentage: 0}
}

const exerciseStats = () => {
  return {activities: 0, duration: 0, distance: 0}
}


const Journal = ({ currentUser }) => {
  // isoWeek = start/end of ISO week = monday - sunday
  const [startDate, setStartDate] = useState(moment().startOf('isoWeek').toDate());
  const [endDate, setEndDate] = useState(moment().endOf('isoWeek').toDate());
  const [weeklyGoal, setWeeklyGoal] = useState(weeklygoalData());
  const [weeklyGoalList, setWeeklyGoalList] = useState({value: 0});
  const [exerciseData, setExerciseData] = useState(zeroExerciseList());
  const [exerciseSummary, setExerciseSummary] = useState(exerciseStats());


  const goalResponse = useQuery(GOAL_QUERY, {variables: {name: currentUser}})
  const exerciseResponse = useQuery(EXERCISE_QUERY, {
    variables: {
      name: currentUser,
      start_date: moment(startDate).format('DD-MM-YYYY'),
      end_date: moment(endDate).format('DD-MM-YYYY'),
    },
    notifyOnNetworkStatusChange: true,
    // fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (goalResponse.data){
      const goalResult = goalResponse.data.weeklyGoal;
      // check for results in graphql response
      if (goalResult.success && goalResult.results.length > 0){
        const goal = goalResult.results[0]
        setWeeklyGoalList(goal);
      }
      else {
        setWeeklyGoalList({value: 0})
      }
    }
  }, [goalResponse, currentUser])

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
      setExerciseData([...exerciseList]);
    };

    // check for data object
    if (exerciseResponse.data) {
      const exercises = exerciseResponse.data.exerciseStats;

      // check for results in graphql response
      if (exercises.hasOwnProperty('results')){
        if (exercises.success && exercises.results.length > 0){
          updateExerciseCount(exercises);
        }
        else {
          // no data present - reset to 0 
          setExerciseData(zeroExerciseList());
          setWeeklyGoal(weeklygoalData());
          setExerciseSummary(exerciseStats());
        }
      }
    }
  }, [exerciseResponse, currentUser, startDate, endDate]);

  useEffect(() => {
    // check for save access
    let exerciseTotal
    if (weeklyGoalList.value > 0 ) {
        if (exerciseResponse.data) {
      const exercises = exerciseResponse.data.exerciseStats;

      // check for results in graphql response
      if (exercises.hasOwnProperty('results')){
        if (exercises.success && exercises.results.length > 0){
            const duration = exercises.results[0].totalDuration;
            const distance = exercises.results[0].totalDistance;
            const activities = exercises.results[0].totalCount;

          if (weeklyGoalList.goal === "Duration") {
             exerciseTotal = duration
          }
          else if (weeklyGoalList.goal === "Distance") {
              exerciseTotal = distance
          }

          const GoalPercentage= Math.floor((exerciseTotal / weeklyGoalList.value) * 100)
          setWeeklyGoal({ exercise: exerciseTotal,  percentage: (GoalPercentage < 100) ? GoalPercentage : 100});
          setExerciseSummary({activities: activities, duration: duration, distance: distance})
        }
      }
    }
  }

  }, [exerciseResponse, weeklyGoalList])
 
  // handle loading and error states
  if (exerciseResponse.loading || exerciseResponse.networkStatus === NetworkStatus.refetch) return <p>Loading...</p>;
  if (exerciseResponse.error) return <p>Error: {exerciseResponse.error.message}</p>;
    
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

  const makeStatsList = () => {
      return Object.entries(exerciseSummary).map(([key, value], index) => (
          <li key={index} className="exercise-summary">
            <strong>{key}: </strong> {value}
          </li>
        ))
  }

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
        <text>Weekly Goal</text>
        <ResponsiveContainer>
          <RadialBarChart 
            startAngle={90} // adjust start/end angle to make rotate clockwise
            endAngle={-270} 
            innerRadius={60} 
            outerRadius={80} 
            barSize={15} 
            data={[weeklyGoal]}
            >
            {/* Title */}
            <PolarAngleAxis
              type="number"
              domain={[0, weeklyGoalList.value]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={5}
              background
              clockWise={true}
              cornerRadius={10 / 2}
              dataKey="exercise"
            >
                <Cell
                  key={`cell-1`}
                  fill={weeklyGoal['percentage'] === 100 ? "#49ff8f" : "#8884d8"} // adjust colour for 100% goal
                />
            </RadialBar>
            {/* Label component for text */}
            <text x='50%' y='50%' textAnchor='middle' style={{ fontSize: 20, fontWeight: 'bold', dominantBaseline:'middle' }}>
                  {`${weeklyGoal['percentage']}%`}
            </text>
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
        </div>
        <div className='list-container'>
          <text style={{marginBottom: "10px"}}>Summary</text>
          <ul> {makeStatsList()} </ul>
        </div>
      </div>

      <br></br>
      <div className="exercise-bar-chart"> 
      <text>Daily Exercise</text>
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