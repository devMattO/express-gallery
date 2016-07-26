const express = require('express');
const app = express();
/*****MIDDLEWARE********/
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
/******DB MODULES*******/
const db = require('./models');
const Gallery = db.Gallery;
const User = db.User;
const CONFIG = require('./config/config.json');
/****ROUTER MIDDLEWARE******/
const galleryRouter = require('./routes/gallery');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.set('view engine','jade');
app.set('views', './templates');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(session({
  secret: CONFIG.SECRET,
  saveUnitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ where:{username: username}  })
    .then( user => {
      if(user == null){
        return done(null, false);
      }
      if(user.username === username && user.password === password){
        return done(null, user);
      }
      return done(null, false);
    })
    .catch( err => {
     return done(err);
    });
  }
));

passport.serializeUser((user, done)=>{
  return done(null, user);
});

passport.deserializeUser((user, done)=>{
  return done(null, user);
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

app.use('/', galleryRouter);


app.listen(3000, function() {
  db.sequelize.sync();
});

const isAuthenticated = (req, res, next) => {
  if(!req.isAuthenticated){
    return res.redirect('/login');
  }
  return next();
};