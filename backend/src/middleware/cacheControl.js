const nodeCache = require('node-cache');
const cache = new nodeCache({ stdTTL: 600 }); // Creating cache with default TTL of 600 seconds

const setCacheControl = (req, res, next) => {
    const key = req.originalUrl;
    const cachedData = cache.get(key);
    if (cachedData) {
        // If cached data is found, setting Cache-Control header and sending cached data
        res.set('Cache-Control', 'public, max-age=300');
        return res.status(200).json(cachedData);
    }
    // Overriding res.json to cache the response data
    const originalJson = res.json.bind(res);
    res.json = (data) => {
        cache.set(key, data); // Caching the response data
        res.set('Cache-Control', 'public, max-age=300');
        originalJson(data);
    };

    next();
};

module.exports = setCacheControl;