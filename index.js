const express = require('express');
const dotenv  = require('dotenv');
const mongoose = require('mongoose');

dotenv.config()

const app = express();

app.use(express.json());

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true },() => {
    console.log("Connected to DataBase");
});


PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Up and Running on port ${PORT}...`));
