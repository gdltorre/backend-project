Readme:
This project is made to be ran in Intel based processors. If running in Apple's M1/M2/M3 chip, run the following commands:
```
rm -rf node_modules
npm install
```

'''
Before attemtping to connect to the database, make sure to create the admin user and the database_admin database with the following commands:
'''
createuser -s admin
createdb admin_database
'''
Setup the database with 
'''
docker-compose up -d
'''
Access the database by running command:
'''
psql -h localhost -p 5432 -U admin -d admin_database
'''
Lastly, relations weren't created automatically, after logging in to the database with the command, execute this code:
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);
```
Run the application with 
'''
npm run start:dev
'''
Docker and Postman are recommended to test the endpoints.
