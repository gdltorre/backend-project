Readme:
This project is made to be ran in Apple's M1 based processors. If running in Intel's based processor, run the following commands:
```
rm -rf node_modules
npm install
```
Make sure to run: to install all required dependencies
```
npm install
```

Setup the database with 
```
docker-compose up -d
```

Access the database by running command:
```
psql -h localhost -p 5432 -U admin -d admin_database
```

Run the application with 
```
npm run start:dev
```

Run application tests with both:
```
npm run test
npm run test:e2e
```

Endpoints for user management:

Register a new user:
POST to http://localhost:3000/auth/register
With body:
```
{
  "username": "testuser",
  "name": "Test User",
  "password": "testpassword",
  "email": "testuser@example.com"
}
```

Login User:
POST to http://localhost:3000/auth/login
With body:
```
{
      "username": "testuser",
      "password": "testpassword"
}
```
Post a Task:
After successfully authenticating with a user Token, you can assign a Task to a user by: 
POST to http://localhost:3000/tasks
With body:
```
{
    "description": "description",
    "title": "title",
    "status": "TODO"
}
```

Get all users:
GET to http://localhost:3000/auth/users
Headers: auth token

Get all tasks:
GET to http://localhost:3000/tasks

Get user by id:
GET to http://localhost:3000/auth/users/'id'
For example: http://localhost:3000/auth/user/7

Get tasks by id:
GET to http://localhost:3000/tasks/'id'
For example: http://localhost:3000/tasks/4


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
