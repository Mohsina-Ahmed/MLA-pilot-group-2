# Use the official Nginx image as the base image
FROM nginx:latest

# Copy custom Nginx configuration file into the container
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to allow outside access to the Nginx server
EXPOSE 80

# Command to start Nginx when the container is run
CMD ["nginx", "-g", "daemon off;"]