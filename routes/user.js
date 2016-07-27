const Express = require('express');
const Router = Express.Router();
const fs = require('fs');
const db = require('../models');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

Router.get('/logout', (req,res)=>{
  req.logout();
  res.redirect('/');
});
Router.get('/login', (req, res) => {
  return res.render('login');
});


Router.get('/new_user', (req, res) => {
  return res.render('new_user');
});

Router.post('/new_user', (req, res) => {
  let hashPassword = '';
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
    db.User.create({
        username: req.body.username,
        password: hash,
      })
    .then ( _ => {
      db.Gallery.findAll()
      .then((data) => {
        return res.render('gallery/index', {
          pics: data,
          main_pic: data[1]
        });
      })
      .catch( err => {
        return res.send({'success': false});
      });
    })
    .catch( err => {
      return res.send({'success': false});
    });
  });
    });
  });

module.exports = Router;