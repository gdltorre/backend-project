Readme:
This project is made to be ran in Apple's M1 based processors. If running in Intel's based processor, run the following commands:
```
rm -rf node_modules
npm install
```

# no longer needed
Before attemtping to connect to the database, make sure to create the admin user and the database_admin database with the following commands:
```
createuser -s admin
createdb admin_database
```


Setup the database with 
```
docker-compose up -d
```

Access the database by running command:
```
psql -h localhost -p 5432 -U admin -d admin_database
```

# no longer needed
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
```
npm run start:dev
```

Endpoints for user management:

Register a new user:
POST to http://localhost:3000/auth/register
With body:
```
{
  "username": "liveUser2",
  "name": "live",
  "password": "livePassword",
  "email": "testuser@example.com",
  "tasks": {
    "id": 5,
    "description": "description",
    "title": "title",
    "status": "activated",
    "user": "testuser"
  }
}
```

Login User:
POST to http://localhost:3000/auth/login
With body:
```
{
      "username": "gerardo123",
      "password": "gerardo1234"
}
```

Get all users:
GET to http://localhost:3000/auth/users
Headers: auth token

Get user by id:
GET to http://localhost:3000/auth/user/%7B%7Buser.id%7D%7D
For example: http://localhost:3000/auth/user/7

This project is using JWT for authentication, so any call other than login/register will require the headers to include the access_token from the login.

To achieve that, you neeed to send a POST to login with the username and password. You will receive a response with an { access_token: "eyTokenExample" }

Once you have copied that token, you include a key Authorization with value "Bearer {{access_token}}".

For example, after logging in you get something similar to this:
```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpdmVVc2VyMiIsInN1YiI6NiwiaWF0IjoxNzI0NzQ5MDkyLCJleHAiOjE3MjQ3NTI2OTJ9.DIR0uujNISqSRyYJPOAvcva_UFIpFqcwFeu5g6Hw3mQ"
}
```

So you would include this in the headers of calls that need authentication

Key: Authorization
Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxpdmVVc2VyMiIsInN1YiI6NiwiaWF0IjoxNzI0NzQ5MDkyLCJleHAiOjE3MjQ3NTI2OTJ9.DIR0uujNISqSRyYJPOAvcva_UFIpFqcwFeu5g6Hw3mQ


Postman is recommended to manage all of that 
