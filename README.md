# User/Order Management for food ordering application

An application demonstrating the use of MEAN stack to create APIs for user and order management for a food delivery application.

Getting started: 
- Clone repository, and install all dependencies.
- Navigate to root folder in command line, and type `npm start`.
- This initiates the MongoDB server (In case of errors, make sure ports are not blocked by other listeners). 
- After the "Connected" prompt appears, open up Postman GUI, and follow the instructions provided.  

## User Management
Operation | Request | URL
--------- | --------|----
Get all users | GET | http://localhost:3000/users/
Get user with specific Id | GET | http://localhost:3000/users/:userId    
Create new user | POST | http://localhost:3000/users/
Update user | PATCH | http://localhost:3000/users/:userId

## Order Management
Operation | Request | URL
--------- | --------|----
Get all orders placed by user (individual/sharing) | GET | http://localhost:3000/users/:userId/orders
Bill user | GET | http://localhost:3000/users/:userId/checkout
Create new order | POST | http://localhost:3000/users/:userId/orders/
Modify existing order | PATCH | http://localhost:3000/users/:userId/orders/:orderId
