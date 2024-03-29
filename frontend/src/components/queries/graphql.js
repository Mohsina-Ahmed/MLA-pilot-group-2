import { gql } from '@apollo/client';

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
        totalDuration
        totalDistance
        exerciseCount {
          date
          count
          dailyDuration
          dailyDistance
        }
      }
    }
  }
  `;

  export {JOURNAL_QUERY, EXERCISE_QUERY}