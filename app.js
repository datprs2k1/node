require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const mongoClient = require('mongoose');

//Setup database
mongoClient.connect('mongodb://localhost:27017/node')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error(err));
;

const app = express();

const userRoutes = require('./routes/user');

//middleware
app.use(logger('dev'));
app.use(bodyParser.json());

//Routes
app.use('/user', userRoutes);

//Routes
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Hello World OK'
    });
});


//Error 404
app.use((res, req, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error Handler
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    return res.status(status).json({
        error: {
            message: error.message
        }
    });
});

//start the server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));