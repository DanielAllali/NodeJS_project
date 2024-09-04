# NodeJS final
## API documentation: [Postman](https://documenter.getpostman.com/view/36795440/2sAXjM4rZW)

## Table of Contents

- [About the Project](#about-the-project)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

Brief description of the project:
This project is a backend system built using Node.js that manages users and cards.
It handles user authentication, authorization, and provides various functionalities for managing user data and cards.
The system is designed to support both regular users and business users with specific features for each.

Purpose: The project is designed to manage users and their related data, such as personal information and business-related cards.
It aims to provide a secure and efficient backend system for handling these operations.

Goal: To create a reliable, scalable, and secure backend that facilitates user registration,
authentication, and CRUD operations on user and card data.

User Management:

Registration and Login: Users can register and log in to the system.
Authorization: Different levels of access for regular users, business users, and administrators.
User CRUD Operations: Admins can manage all users, and users can manage their own data.
Business Status Management: Registered users can change their isBusiness status.
Card Management:
View Cards: Users can view all cards or their own cards.
Create, Edit, Delete Cards: Business users can create new cards, edit existing cards, and delete them if necessary.
Like Cards: Registered users can like cards, and this action will be reflected in the card data.

## Technologies Used

- **Node.js** - JavaScript runtime environment.
- **Express.js** - Web framework for Node.js.
- **MongoDB** - NoSQL database (or specify another database if used).
- **Mongoose** - ODM for MongoDB.
- **Joi** - For data validation (or any other library if applicable).
- Other libraries or technologies you used.

## Getting Started
1. Install project from github.
2. Download npm to the project (node_modules) to download run in the project terminal "npm install".
3. Run it in your code editor for example visual studio code.
4. Download MongoDB [MongoDB](https://www.mongodb.com/try/download/community).
5. Change in .env file the MONGO_URI to your MongoURI.
6. Write in the project terminal "npm run nodemon".
7. Now make requests, you can use postman or by code.

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (vX.X.X)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

