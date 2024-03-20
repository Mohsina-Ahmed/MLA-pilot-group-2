# Use an official Node.js runtime as the base image
FROM cypress/browsers:node14.19.0-chrome100-ff99-edge

# Set the working directory in the container
WORKDIR /app

# Install mongoose dependencies
COPY ./package.json .
COPY ./cypress.config.js .
COPY ./cypress ./cypress

RUN npm install

# verify the cypress installation
RUN npx cypress verify
# RUN ping 127.0.0.1
