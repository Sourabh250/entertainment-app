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

app.use(redirect);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use('/api', routes);

app.use(errorHandler);

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