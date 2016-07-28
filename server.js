'use strict';
const express = require('express');
const app = express();
/*****MIDDLEWARE********/
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
/******DB MODULES*******/
const db = require('./models');
const Gallery = db.Gallery;
const User = db.User;
let CONFIG;
try{
  CONFIG = require('./config/config.json');
}catch(e){
  CONFIG = false;
}
/****ROUTER MIDDLEWARE******/
const galleryRouter = require('./routes/gallery');
const userRouter = require('./routes/user');

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
  secret: CONFIG.SECRET || process.env.secret,
  saveUnitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ where:{username: username}  })
    .then( user => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          if(user.username === username){
            return done(null, user);
          } else{
            return done(null, false);
          }
        }
        return done(null, false);
      });
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

app.post('/user/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login'
  }));

app.get('/', (req, res) => {
  res.redirect('/gallery');
});
app.use('/gallery', galleryRouter);
app.use('/user', userRouter);


app.listen(3000, function() {
  db.sequelize.sync();
});

const isAuthenticated = (req, res, next) => {
  if(!req.isAuthenticated){
    return res.redirect('/login');
  }
  return next();
};