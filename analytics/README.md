## Analytics service

The analytics service is a backend component of the MLA fitness tracker app. 

This service is built using Python and Flask. 

The analytics service pulls information from the mongodb database and returns to the graphql queries. 

### Prerequisites

handled by requirements.txt
```sh
pip install -r requirements.txt
```

#### Running the Flask application

```sh
cd analytics
flask run -h localhost -p 5050
```

### testing

unit test are implemented using the pytest module. 

To run the tests independently, execute: 

```sh
docker compose run --build --rm analytics pytest -rA --setup-show 
```
-rA = get test summary for all (i.e. see stdout print statements) 