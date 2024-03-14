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
      totalCount
      totalDuration
      exercises {
        date
        exerciseType
        totalDuration
      }
    }
  }
}