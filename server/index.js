const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();


// Middleware
app.use(bodyParser.json());
app.use(cors());


global.Characters = require('./api/models/characterModel');
global.Comics = require('./api/models/comicModel');
global.Authors = require('./api/models/authorModel');

const routes = require('./api/routes/route');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(
    'mongodb://localhost/marvel',
    { useNewUrlParser: true, useUnifiedTopology: true }
);



const port = process.env.PORT || 5000;

routes(app);

app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` });
});

app.listen(port, () => console.log(`Server started on port ${port}`));