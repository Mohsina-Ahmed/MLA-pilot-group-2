# Use the official MongoDB image as the base image
FROM mongo:7.0.11

#ARG MONGO_USERNAME
#ARG MONGO_PASSWORD

#ENV MONGO_USERNAME=$MONGO_USERNAME
#ENV MONGO_PASSWORD=$MONGO_PASSWORD

ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=cfgmla23

# Create a directory to store MongoDB data
RUN mkdir -p /data/db

# Set permissions for the data directory
RUN chown -R mongodb:mongodb /data/db

# Expose MongoDB default port
EXPOSE 27017

# Start MongoDB when the container is run
CMD ["mongod"]