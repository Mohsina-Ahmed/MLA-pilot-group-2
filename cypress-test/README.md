### end 2 end cypress tests 

cypress is configured to run within the docker containers - this provides the ability to access and control test data within the mongoDB database
docker compose has been updated to create a external app network to link with the cypress container 

A 'testUser' is created on each test run, any prior data is deleted at the start of the cypress tests

### note: url paths must be updated to IP address of the docker container ###

### IMPORTANT ###
the REACT_APP_API_GATEWAY_URL (frontend) and CYPRESS_API_GATEWAY_URL (cypress) must be set to the docker container IP address. 

the default IP for a docker network is 172.20.0.1 - but unfortunately this can not be assumed and may change.

to find the container network IP, exec the following commands:

```sh
docker compose up --build # need to build containers to check network IP
```
Note down the gateway IP from this command - this is the REACT_APP_API_GATEWAY_URL
```sh 
docker network inspect mla_app_network | grep -i Gateway  
```
```sh
docker compose down
```

in the docker-compose-cypress.yml
### set CYPRESS_API_GATEWAY_URL (in the cypress service) to the mla_app_network gateway IP found above
- e.g. CYPRESS_API_GATEWAY_URL=http://172.20.0.1

in the frontend Dockerfile (/frontend/e2e.Dockerfile)   
### set the REACT_APP_API_GATEWAY_URL to you mla_app_network gateway IP
- e.g. REACT_APP_API_GATEWAY_URL=http://172.20.0.1


### to execute tests 

build application and run the tests with: 

```sh
    docker-compose -f docker-compose-cypress.yml up --build cypress
```
after the initial build, the tests can then be run with 
```sh
    docker-compose -f docker-compose-cypress.yml up cypress
```

## extra 

a second docker-compose-cypress file is also available in the cypress-test folder 
This file will connect with the docker container network and allow you to run the cypress tests. 

This can be help when building test cases. i.e. you can have the application server running continuously, and only have to update the cypress container. 

### IMPORTANT #### in this setup you must also set the IP of mongodb 
to find the address

```sh 
    docker inspect mla-pilot-group-2_mongodb_1 | grep -i IPAddress
```
and update the CYPRESS_MONGO_URI in the cypress-test/docker-compose-cypress.yml - the IP value between @172.... :  
- e.g. CYPRESS_MONGO_URI=mongodb://root:cfgmla23@172.20.0.3:27017

# to use this file 

build the application with the cypress setup 
```sh 
    docker-compose -f docker-compose-cypress.yml up --build 
```
change directory 
```sh 
    cd cypress-test
```
build with: 

```sh 
    docker-compose -f docker-compose-cypress.yml up --build
```
then run with: 
```sh 
    docker-compose -f docker-compose-cypress.yml up 
```


### TROUBLESHOOTING ### 

Cypress was added into the .devcontainer set to handle any setup and install issues. 
if the npx verify passes, but the test fail with - cypress-1 | Error: Cannot find module 'cypress'
try installing cypress locally

```sh 
cd cypress-test
npm install cypress
https://docs.cypress.io/guides/getting-started/installing-cypress
```


