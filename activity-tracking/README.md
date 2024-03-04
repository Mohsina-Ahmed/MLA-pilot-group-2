# MLA Fitness App
# Activity Tracking Microservice

This service builds the activity tracking component of the Fitness Tracker App, exposing the Track Exercise page to the user. On this page, the user can record an exercise that they have completed, this information is saved to the database and utilised by the analytics service to provide analysis on the exercises tracked by the user.

The Activity Tracking functionality uses the MERN stack (MongoDB, Express.js, React, Node.js).

# Current Features
- Log exercises of types: running, cycling, swimming, gym and other.
- Record date and duration of exercise.
- Add a description of the exercise.
- All information is stored in MongoDB database when saved.
- Stored exercises are analysed in analytics service.

# Prerequisites
- Node.js
- MongoDB
- npm or yarn

# Developments
- 16/02/24 - changing order of fields and changing description field to a exercise title - branch gbTask1 - PR3 - files updated: trackExercise.js, exercises.js, exercise.model.js
- 16/02/24 - addition of distance field so users can record distance of exercise - branch gbTask1 - PR3 - files updated: trackExercise.js, exercises.js, exercise.model.js
- 16/02/24 - addition of 'How did it feel?' item - users select icon to record mood - branch gbTask1 - PR3 - files updated: trackExercise.js, exercises.js, exercise.model.js
- 20/02/24 - tidying up form alignment and adding tooltip labels to icons - branch gbTask2 - PR8 - files updated: App.css, trackExercise.js
- 20/02/24 - addition of reps and sets fields for gym, changing default metrics depending on exercise selection - branch gbTask2 - PR8 - files updated: trackExercise.js, exercises.js, exercise.model.js, App.css
- 21/02/24 - addition of dropdown list for 'other' exercise icon, list of additional exercises to choose, e.g. Rowing, Surfing, Golf - branch gbTask3 - PR9 - trackExercise.js, exercises.js, exercise.model.js, App.css
- 21/02/24 - re-adding of 'Title your exercise:' label in form - branch gbTask3 - PR9 - trackExercise.js
- 21/02/24 - addition of auto-calculated speed field, calculates when duration and distance added - branch gbTask4 - PR10 - files updated: trackExercise.js, exercises.js, exercise.model.js
- 23/02/24 - MongoDB split into 2 databases - authdb and activitydb - exercises now stored in activitydb - branch maTask2 - PR13 - files updated: docker-compose.yml, config.json, server.js, .env, application.properties
- 04/03/2024 - branch ma_Task3 - AWS ECR connected - updated GitHub repositories with AWS secrets and now all the workflows are working.

# AWS ECR:
<img width="873" alt="image" src="https://github.com/Mohsina-Ahmed/MLA-pilot-group-2/assets/122023111/241229ed-47b1-4f0f-9dbc-c06406c864cb">


# Current Page View:

![Screenshot](screenshots/Activity_Tracking_Page.png)  ![Screenshot](screenshots/Activity_Tracking_Addnl_Exercises.png)

# Testing

- Before implementing changes to the codebase, all ideas are BDD tested, writing User Stories, Acceptance Criteria and tested using Cucumber. These are stored locally, not within the Fitness Tracker App repository.

- A new branch is created off main to develop all changes to the codebase. Changes are tested thoroughly locally, before commiting and issuing pull request to main in the remote repo.

- All pull requests are detailed in GitHub to explain the changes made to the code. At least one team member performs a code review before accepting the PR or requesting amendments.

- Once new code has been merged with main, team members update their local repo's by pulling changes from the remote origin. All members test that the new developments are working locally and feedback to the issuer of the PR.

Upcoming developments to testing:
- Unit testing has been developed using Jest for the activity tracking service. This will be implemented into the workflow.
- Once the app deployment pipeline is set-up, thorough tests will be developed for the CI/CD pipelines that implement automatically when code is merged.

