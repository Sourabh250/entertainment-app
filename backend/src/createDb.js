const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const movieModel = require("./models/movie");
const tvSeriesModel = require("./models/tvSeries");
const userModel = require("./models/user");

const apiKey = process.env.TMDB_API_KEY;
const dbUrl = process.env.DATABASE_URL;

const movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
const tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}`;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


const fetchAndPopulate = async (url, model) => {
  try {
    const response = await axios.get(url);
    const data = response.data.results;
    const type = model.modelName === "Movie" ? "movie" : "tv";
    const detailedItems = await Promise.all(
      data.map(async (item) => {
        const detailUrl = `https://api.themoviedb.org/3/${type}/${item.id}?api_key=${apiKey}&append_to_response=credits`;
        const detailResponse = await axios.get(detailUrl);
        const details = detailResponse.data;

        const itemDetails = {
          ...item,
          status: details.status || "N/A",
          runtime: details.runtime || 0,
          genre: details.genres || [],
          tagline: details.tagline || "N/A",
          cast: details.credits.cast || [],
          homepage: details.homepage || "N/A",
          imdb_id: details.imdb_id || "N/A",
          last_air_date: details.last_air_date || "N/A",
        };

        const isValid = Object.keys(model.schema.obj).every((field) => {
          // If the field is required and the value is missing, mark the item as invalid
          if (model.schema.obj[field].required && !itemDetails[field]) {
            console.log(
              `Skipping item with id ${item.id} due to missing required field: ${field}`
            );
            return false;
          }
          return true;
        });

        return isValid ? itemDetails : null;
      })
    );
    const filteredItems = detailedItems.filter((item) => item !== null);
    
    await model.insertMany(filteredItems);
  
    console.log(`Db populated with data to ${model.modelName}`);
  } catch (error) {
    console.error(`Error fetching data or populating the database:`, error);
  }
};

const refreshAll = async () => {
  await movieModel.deleteMany({});
  await tvSeriesModel.deleteMany({});
  await fetchAndPopulate(movieUrl, movieModel);
  await fetchAndPopulate(tvUrl, tvSeriesModel);
  await mongoose.disconnect();
};
refreshAll();