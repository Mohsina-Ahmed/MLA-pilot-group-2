# MLA Fitness App

A simple and interactive fitness tracking application built with multiple microservices and programming languages. This application allows users to track their exercises and monitor their progress over time.

The Activity Tracking functionality uses the MERN stack (MongoDB, Express.js, React, Node.js), the Analytics service uses Python/Flask and the Authentication Microservice using Java.

![Screenshot](screenshots/frontpage.png)

### Current Features

- User registration for personalized tracking
- Log various types of exercises with descriptions, duration, and date
- See weekly and overall statistics
- Interactive UI with Material-UI components
- Real-time data persistence with MongoDB

### Prerequisites

- Node.js
- MongoDB
- npm or yarn
- Python Flask
- Java 8
  (all already installed in the devcontainer)

### Frontend Developments

#### Sign Up:
  - Adding personal information to signup.js form, including first name, surname, email address, date of birth, height and weight. This is for use on user profile and to tailor calculations to the user.
  - Adding validation messages to the user for password, email address and date of birth.

#### User Profile:
  - Adding new component userProfile.js so the user can view and update their personal information and exercise goals.

#### Homepage:
  - Adding new component homepage.js as the landing page for the app. This gives the user a personalised homepage giving an overview of their recent activity.

#### Track Exercise:
  - Adding more exercises that the user can track - improving inclusivity.
  - Adding distance, sets, reps, speed and pace so the user can track their performance.
  - Adding calories burned calculation which is personalised using the user's weight. This is based upon the intensity selected by the user also.
  - Adding in icons for the user to track how the exercise felt.

#### Unit testing:
  - Unit testing has been developed using Jest for frontend components.
  - This has been implemented to run via Docker - npm test is run after the build stage is complete. If unit tests fail, the app will not run and the test logs will be shown in the terminal.

#### Accessibility:
  - Aria-labels have been added to frontend components to improve accessibility for user's that use screen readers.


