# MLA Fitness App 

A simple and interactive fitness tracking application built with multiple microservices and programming languages. This application allows users to track their exercises and monitor their progress over time.

The Activity Tracking functionality uses the MERN stack (MongoDB, Express.js, React, Node.js) and the Analytics service uses Python/Flask (tbc).

![Screenshot](frontpage.png)  

## Current Features

- User registration for personalized tracking
- Log various types of exercises with descriptions, duration, and date
- Interactive UI with Material-UI components
- Real-time data persistence with MongoDB

## Prerequisites

- Node.js
- MongoDB
- npm or yarn

## Local Development

### Clone the repository

```sh
git clone git@github.com:nadinedelia/mla-fitnessapp.git
cd mla-fitnessapp
```

### Install dependencies

```sh
cd activity-tracking
npm install
cd ../frontend
npm install
```

### Start the development servers

```sh
cd activity-tracking
nodemon server
cd ../frontend
npm start
```

### Deployment
The application is containerized using Docker and can be deployed on any platform that supports Docker containers. For AWS deployment, a GitHub Actions pipeline is configured for CI/CD.

### Building with Docker

```
docker-compose up
```

### Connect to MongoDB

```
mongosh -u root -p cfgmla23 --authenticationDatabase admin --host localhost --port 27017
```

show registered activities:
```
db.exercises.find()
```

show registered users:
```
db.users.find()
```

### Running Flask application
```
flask run
```

### Running Java application
```
./gradlew clean build
./gradlew bootRun
```