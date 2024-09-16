// Middleware to handle unexpected errors

const errorHandler = (error, req, res, next) => {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'});
};

module.exports = { errorHandler };