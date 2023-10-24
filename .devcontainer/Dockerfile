# Using Node.js base image
FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# Install essential packages
RUN apt-get update && apt-get install -y wget apt-transport-https gnupg

# Download the GPG key and save it
RUN wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public > /tmp/adoptopenjdk-archive-keyring.gpg

# Move the key to the trusted directory
RUN mv /tmp/adoptopenjdk-archive-keyring.gpg /etc/apt/trusted.gpg.d/

# Add the repository information
RUN echo "deb [signed-by=/etc/apt/trusted.gpg.d/adoptopenjdk-archive-keyring.gpg] https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/adoptopenjdk.list

# Update package list and install OpenJDK 8
RUN apt-get update && apt-get install -y adoptopenjdk-8-hotspot

# Clean up
RUN apt-get clean;

# Install git, Python, pip, Gradle
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install git python3 python3-pip gradle && apt-get clean

# Npm packages installation
RUN npm install -g cors axios express create-react-app

# Install Python requirements
RUN pip3 install Flask pymongo gunicorn python-dotenv Flask-PyMongo Flask-CORS

# Clean up
RUN rm -rf /var/lib/apt/lists/*


