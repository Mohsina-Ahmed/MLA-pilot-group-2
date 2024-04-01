## connect to mongodb
mongosh -u root -p cfgmla23 --authenticationDatabase admin --host localhost --port 27017

Analytics service. 

backend Flask Application. 

Utilising graphql to extract metrics from the mongoDB database. 

GraphQL query: 

query weeklyStats {
    weeklyStats(name: "testUser", start_date: "10-03-2024", end_date: "16-03-2024") {
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

query dailyStats {
    dailyStats(name: "testUser", start_date: "10-03-2024", end_date: "16-03-2024") {
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
