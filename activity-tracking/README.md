# MLA Fitness App
# Activity Tracking Microservice

This service builds the activity tracking component of the Fitness Tracker App, exposing the Track Exercise page to the user. On this page, the user can record an exercise that they have completed, this information is saved to the database and utilised by the analytics service to provide analysis on the exercises tracked by the user.

The Activity Tracking functionality uses the MERN stack (MongoDB, Express.js, React, Node.js).

# Original Features
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
- 07/03/2024 - branch gbTask6 - addition of pace field, preventing future exercise tracking, adding validation prompts for the user, optimising the layout into rows and columns - files updated: trackExercise.js, exercise.model.js, exercise.js, app.css.
- 07/03/2024 - branch unitTesting - addition of unit testing for trackExercise.js - files updated: trackExercise.test.js, Dockerfile, package.json, trackExercise.js, app.test.js (deleted).
- 22/03/2024 - branch gbTask7 - addition of Goal class, adding goal endpoints for user profile - files added: goal.js, goal.model.js - files updated: server.js.
- 28/03/2024 - branch inclusiveUpdate - adding custom activity option to exercise list, changing 'other' icon, adding walking exercise type - files updated: trackExercise.js, exercise.model.js.
- 31/03/2024 - branch inclusiveUpdate - adding calories property to exercise class, adding intensity and calories burned to trackExercise page, updating test cases, adding aria-labels to frontend, adding walking as an icon - files updated: App.css, exercises.js, exercises.model.js, trackExercise.js, trackExercise.test.js.


# AWS ECR:
<img width="873" alt="image" src="https://github.com/Mohsina-Ahmed/MLA-pilot-group-2/assets/122023111/241229ed-47b1-4f0f-9dbc-c06406c864cb">


# Current Page View:

![Screenshot](screenshots/TrackExercise_Page.png)  ![Screenshot](screenshots/Other_Exercises.png)   ![Screenshot](screenshots/Custom_Exercise.png)

# Testing
- Unit testing has been developed using Jest for the activity tracking service. Tests are added to the trackExercise.test.js file and kept up to date when new features are added to the trackExercise.js file.

- Before implementing changes to the codebase, all ideas are BDD tested, writing User Stories, Acceptance Criteria and tested using Cucumber. These are stored locally, not within the Fitness Tracker App repository.

- A new branch is created off main to develop all changes to the codebase. Changes are tested thoroughly locally, before commiting and issuing pull request to main in the remote repo.

- All pull requests are detailed in GitHub to explain the changes made to the code. At least one team member performs a code review before accepting the PR or requesting amendments.

- Once new code has been merged with main, team members update their local repo's by pulling changes from the remote origin. All members test that the new developments are working locally and feedback to the issuer of the PR.

Upcoming developments to testing:


