var express = require('express');
var app = express();
const bodyParser = require('body-parser');
var db = require('./models');
const Gallery = db.Gallery;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.listen(3000, function() {
  db.sequelize.sync();
});
