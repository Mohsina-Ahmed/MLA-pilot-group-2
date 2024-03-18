# Use the official Nginx image as the base image
FROM nginx:latest

# Copy custom Nginx configuration files from the local directory into the container
COPY ./nginx /etc/nginx

# Expose port 80 to allow outside access to the Nginx server
EXPOSE 80

# Command to start Nginx when the container is run
CMD ["nginx", "-g", "daemon off;"]
