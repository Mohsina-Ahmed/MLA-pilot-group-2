import { gql } from '@apollo/client';


const STATS_QUERY = gql
  `query filteredStats($name: String) {
    filteredStats(name: $name) {
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

const STATS_ACTIVITY_QUERY = gql
  `query filteredActivityStats($name: String, $activity: String) {
    filteredActivityStats(name: $name, activity: $activity) {
      success
      errors
      results {
        exercise
        totalDistance 
        totalDuration
      }
    }
  }
  `;


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

const EXERCISE_QUERY = gql
  `query exerciseStats ($name: String, $start_date: String, $end_date: String){
    exerciseStats(name: $name, start_date: $start_date, end_date: $end_date) {
      success
      errors
      results {
        username 
        totalCount
        totalDuration
        totalDistance
        exerciseCount {
          date
          count
        }
      }
    }
  }
  `;

  const GOAL_QUERY = gql
  `query weeklyGoal ($name: String){
    weeklyGoal(name: $name) {
      success
      errors
      results {
        exercise
        goal
        unit
        value
      }
    }
  }
  `;

  const LAST_EXERCISE_QUERY = gql
  `query homePage ($name: String){
    homePage(name: $name) {
      success
      errors
      results {
        exercise
        duration
        date
      }
    }
  }
  `;

  export { STATS_QUERY, EXERCISE_QUERY, GOAL_QUERY, LAST_EXERCISE_QUERY, STATS_ACTIVITY_QUERY }