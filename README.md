# Entertainment App

Welcome to the Entertainment App! This app is designed to provide you with a seamless entertainment experience. Whether you're looking for movies or TV shows, this app has got you covered.

## Features

- Browse a vast library of movies, TV shows
- Search for your favorite entertainment content
- Create personalized bookmarks
- Discover trending and recommended content
- Enjoy a smooth user interface

## Table of Contents

- [Features](#features)
- [Technologies/Languages Used](#technologieslanguages-used)
- [Installation](#installation)
- [Usage](#usage)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Live API Documentation](#live-api-documentation)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## Technologies/Languages Used

| ![Node.js Logo](https://img.shields.io/badge/Node.js-%E2%9C%94-brightgreen) | ![Express](https://img.shields.io/badge/Express-%E2%9C%94-blue) | ![MongoDB](https://img.shields.io/badge/MongoDB-%E2%9C%94-green) | ![React](https://img.shields.io/badge/React-%E2%9C%94-blue) | ![Axios](https://img.shields.io/badge/Axios-%E2%9C%94-lightgrey) |
|:--:|:--:|:--:|:--:|:--:|
| ![Redux](https://img.shields.io/badge/Redux-%E2%9C%94-purple) | ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-%E2%9C%94-pink) | ![Swiper](https://img.shields.io/badge/Swiper-%E2%9C%94-orange) | ![JWT](https://img.shields.io/badge/JSONWebToken-%E2%9C%94-brightgreen) | ![Bcrypt](https://img.shields.io/badge/Bcrypt-%E2%9C%94-blueviolet) |

- **Node.js** - JavaScript runtime used for building the server-side application.
- **Express** - Web application framework for Node.js, used to build the API.
- **MongoDB** - NoSQL database used for storing data.
- **Mongoose** - MongoDB object modeling tool for Node.js.
- **React** - Front-end JavaScript library for building user interfaces.
- **Axios** - Promise-based HTTP client used to make API requests.
- **Redux** - State management library for JavaScript apps, commonly used with React.
- **Framer Motion** - Library for animations in React applications.
- **Swiper** - Modern mobile touch slider with amazing transitions.
- **JSONWebToken (JWT)** - A compact, URL-safe means of representing claims to be transferred between two parties.
- **Bcrypt** - Library for hashing passwords to ensure secure user authentication.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the appropriate project directory.
3. Install the necessary dependencies by running `npm install`.
4. Start the app by running `npm start`.

## Usage

1. Launch the app.
2. Browse through the available categories or use the search feature to find specific content.
3. Click on a movie, TV series  to view more details.
4. Add items to your bookmark by clicking the bookmark icon.

## Setup

To deploy the Entertainment App, you will need to set up both the frontend and backend separately.

#### Frontend

1. Clone the repository to your local machine:
    ```
    git clone https://github.com/Sourabh250/entertainment-app.git
    ```

2. Navigate to the frontend directory:
    ```
    cd frontend
    ```

3. Install the necessary dependencies by running:
    ```
    npm install
    ```
4. Create a `.env` file at the root and add the following:
To run this project, you will need to add the following environment variable to your .env file
`REACT_APP_API_URL`.  
You can use the provided .env.example file as a reference.
    
    REACT_APP_API_URL = your_backend_api_url

5. Start the frontend server:
    ```
    npm start
    ```

6. The frontend will be accessible at `http://localhost:3000`.

#### Backend

1. Navigate to the backend directory:
    ```
    cd backend
    ```

2. Install the necessary dependencies by running:
    ```
    npm install
    ```
3. Create a .env file at the root and add the following:

You will need to add the following environment variables to your .env file.
You can use the provided .env.example file as a reference.

    PORT = 8000
    DATABASE_URL = your_database_connection_string
    TMDB_API_KEY = your_tmdb_api_key
    JWT_SECRET = your_jwt_secret_key
    REFRESH_SECRET = your_refresh_secret_key
    NODE_ENV = development/production
    CORS_ORIGIN = your_frontend_url
    DOMAIN_NAME = your_frontend_domain_name

4. Start the backend server:
    ```
    npm start
    ```

5. The backend will be accessible at `http://localhost:8000`.

## API Endpoints

Here are some  API endpoints. For a full list of API endpoints, check out the [Postman Documentation](https://www.postman.com/sourabhbanik234/workspace/test-workspace/collection/38358652-199eef21-5fc3-4561-8c88-a902fed16933?action=share&creator=38358652).

Get all movies
```
GET /api/movies
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `None` | `None` | Retrieves a list of movies. |

Search Movies
```
GET /api/movies/search/:query
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `query` | `string` | **Required**. Search for movies based on  query. |

Get detailed info about a movie by ID
```
GET /api/movies/details/:id
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. Get detailed info about a movie. |


## Deployment
For deployment, follow these steps:

#### 1. Prepare your environment:
Ensure that environment variables are set and the database is accessible.
#### 2. Deploy to your preferred hosting service:
For example, you can use platforms like Heroku, AWS, or Render.
#### 3. Set up deployment scripts if necessary:
Configure deployment settings according to your hosting provider's guidelines.

[**Render Frontend Link**](https://entertainment-app-frontend-18em.onrender.com)

[**Render Backend Link**](https://entertainment-app-9u0i.onrender.com)

## Live API Documentation
Explore the API documentation and interact with the endpoints via Postman:
- **Production**: [Explore the API documentation](https://www.postman.com/sourabhbanik234/workspace/test-workspace/collection/38358652-199eef21-5fc3-4561-8c88-a902fed16933?action=share&creator=38358652)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Author

- [@Sourabh](https://github.com/Sourabh250) - Developer and maintainer of this project.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)