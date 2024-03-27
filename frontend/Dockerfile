# Build stage
FROM node:14 AS build

WORKDIR /app

ENV REACT_APP_API_GATEWAY_URL=http://172.19.0.1

COPY package*.json ./
RUN npm install
RUN chmod a+x node_modules/.bin/react-scripts
COPY . .
RUN npm run build
RUN npm test

# Run stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
