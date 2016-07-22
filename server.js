const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./models');
const Gallery = db.Gallery;
const galleryRouter = require('./routes/galleryRouter');
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.set('view engine','jade');
app.set('views', './templates');

app.use('/', galleryRouter);

app.listen(3000, function() {
  db.sequelize.sync();
});
