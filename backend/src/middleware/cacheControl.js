const nodeCache = require('node-cache');
const cache = new nodeCache({ stdTTL: 600 });

const setCacheControl = (req, res, next) => {
    const key = req.originalUrl;
    const cachedData = cache.get(key);
    if (cachedData) {
        res.set('Cache-Control', 'public, max-age=300');
        return res.status(200).json(cachedData);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
        cache.set(key, data);
        res.set('Cache-Control', 'public, max-age=300');
        originalJson(data);
    };

    next();
};

module.exports = setCacheControl;