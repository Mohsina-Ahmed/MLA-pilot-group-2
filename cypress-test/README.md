end 2 end cypress tests 

cypress is configured to run within the docker containers - this provides the ability to access and control test data within the mongoDB database. 
note: url paths must be updated to IP address of the docker container 
and docker compose has been updated to create a external app network to link with the cypress container 

NOTE: the REACT_APP_API_GATEWAY_URL needs to be set to the docker container IP address. 

exec the following commands 
run docker compose up --build # need to build containers to check network IP
docker network inspect mla_app_network | grep -i Gateway
docker inspect mla-pilot-group-2-mongodb-1 | grep -i IPAddress
docker compose down

in the frontend Dockerfile 
- set the env variable REACT_APP_API_GATEWAY_URL to you mla_app_network gateway IP
- e.g. ENV REACT_APP_API_GATEWAY_URL=http://172.19.0.1

in the /cypress-test/docker-compose-cypress.yaml 
- set the CYPRESS_API_GATEWAY_URL value > e.g CYPRESS_API_GATEWAY_URL=http://172.19.0.1
- update the CYPRESS_MONGO_URI with the mongo container IP - and port number 
- e.g. CYPRESS_MONGO_URI=mongodb://root:cfgmla23@172.19.0.3:27017 



to execute tests 

build application: 

    docker compose up --build 

change to cypress-test directory: 

    cd cypress-test

run the cypress docker compose file with: 

    docker-compose -f docker-compose-cypress.yaml up --build


