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

### MongoDB

A Dockerfile has been added to push the docker container into the ECR repository mla-fitness-mongodb.
Added volumn into the Dockerfile to persist the data.
