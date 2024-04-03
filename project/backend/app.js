const express = require("express");
const cors = require('cors');

const bodyParser = require("body-parser");

const mongoRoute = require('./src/routes/mongoRoute');
const firebaseRoute = require('./src/routes/firebaseRoute');
const secApiUtilsRoute = require('./src/routes/secApiUtilsRoute');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/auth', firebaseRoute);
app.use('/db', mongoRoute);
app.use('/secapiutils',secApiUtilsRoute);
module.exports = app;
const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
    console.log(`Server is running on port ${PORT}`);
});