const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { redirect } = require('./middleware/redirect');
const { errorHandler } = require('./middleware/errorHandler');
dotenv.config();

const PORT = process.env.PORT || 8001;
const dbUrl = process.env.DATABASE_URL;
const corsOrigin = process.env.CORS_ORIGIN || '*';

// CORS options to allow credentials and specific origin
const corsOptions = {
  origin: corsOrigin,
  credentials: true, // Allowing cookies and other credentials to be sent
};

app.use(redirect); // Custom middleware for handling redirects
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors(corsOptions)); // Middleware to enable CORS with options
app.use(helmet()); // Middleware to set various HTTP headers for security
app.use('/api', routes); // Middleware to use the routes
app.use(errorHandler); // Custom middleware for error handling

// Function to start the server and connect to MongoDB
const startServer = async() => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
  } catch(error) {
    console.error('MongoDB connection error:', error);
  }
};

startServer();