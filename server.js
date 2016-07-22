const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models');
const Gallery = db.Gallery;
const galleryRouter = require('./routes/galleryRouter');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.set('view engine','jade');
app.set('views', './templates');

app.use('/', galleryRouter);

app.listen(3000, function() {
  db.sequelize.sync();
});
