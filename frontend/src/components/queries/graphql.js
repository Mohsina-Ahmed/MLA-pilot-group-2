import { gql } from '@apollo/client';

const STATS_ACTIVITY_QUERY = gql
  `query filteredActivityStats($name: String, $activity: String) {
    filteredActivityStats(name: $name, activity: $activity) {
      success
      errors
      results {
        longestDistance 
				longestDuration
				fastestPace 
				totalDistance
				totalDuration
				totalActivities
      }
    }
  }
  `;

const WEEK_QUERY = gql
  `query weeklyStats ($name: String, $start_date: String, $end_date: String){
    weeklyStats(name: $name, start_date: $start_date, end_date: $end_date) {
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
  `query lastExercise ($name: String){
    lastExercise(name: $name) {
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

  const CALORIES_QUERY = gql
  `query dailyCalories ($name: String, $today_date: String){
    dailyCalories(name: $name, today_date: $today_date) {
      success
      errors
      results {
        daily_calories
      }
    }
  }
  `;

  const CALORIES_GOAL_QUERY = gql
  `query caloriesGoal ($name: String){
    caloriesGoal(name: $name) {
      success
      errors
      results {
        value
      }
    }
  }
  `;

  export { STATS_ACTIVITY_QUERY, WEEK_QUERY, GOAL_QUERY, LAST_EXERCISE_QUERY, CALORIES_QUERY, CALORIES_GOAL_QUERY }