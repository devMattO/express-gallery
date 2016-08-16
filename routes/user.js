const Express = require('express');

const Router = Express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

const saltRounds = 10;

Router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

Router.get('/login', (req, res) => res.render('login'));


Router.get('/new_user', (req, res) => res.render('new_user'));

Router.post('/new_user', (req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (error, hash) => {
      db.User.create({
        username: req.body.username,
        password: hash,
      })
    .then(() => res.redirect('/'))
    .catch(() => res.send({ success: false }));
    });
  });
});

Router.get('/:id/gallery', (req, res) => {
  db.Gallery.findAll({
    where: {
      UserId: req.params.id,
    },
  })
  .then(data => {
    if (!data.length) {
      return res.render('user/user_gallery', {
        no_pics: true,
        logged_in: true,
        user: req.user,
      });
    }
    return res.render('user/user_gallery', {
      pics: data,
      logged_in: true,
      user: req.user,
      no_pics: false,
    });
  });
});

module.exports = Router;
