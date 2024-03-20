end 2 end cypress tests 

cypress is configured to run within the docker containers 
note: url paths updated to IP address of the docker container 
and docker compose updates to create a external app network to link with cypress container 

to execute tests 

build application: 

docker compose up --build 

change to cypress-test direction: 

cd cypress-test

run the cypress docker file 

docker-compose -f docker-compose-cypress.yaml up