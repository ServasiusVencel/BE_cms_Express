const express = require('express')
const app = express();
const port = 3000;
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();

app.use(cors());
app.use(express.json());

const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, mongooseConfig)
    .then(() => console.log('Database connected'))
    .catch(err => {
        console.log(`Failed to connect to database: ${err.message}`);
        process.exit();
    });


    require('./routes/admin')(app);
    require('./routes/about')(app);
    require('./routes/service')(app);

    app.listen(port, () => {
        console.log(`server berjalan di http://localhost:${port}`);
    });
        