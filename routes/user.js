const Express = require('express');
const Router = Express.Router();
const fs = require('fs');
const db = require('../models');
const passport = require('passport');

Router.get('/user', (req, res) => {
  return res.render('user/index');
});


module.exports = Router;