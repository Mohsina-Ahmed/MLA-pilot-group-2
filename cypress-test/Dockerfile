# Use an official Node.js runtime as the base image
FROM cypress/included:8.6.0

# Set the working directory in the container
WORKDIR /app

# Install mongoose dependencies
RUN npm install mongoose@^7.5.4
RUN npm install mongodb-memory-server@9.0.0

# verify the cypress installation
RUN npx cypress verify
# RUN ping 127.0.0.1
