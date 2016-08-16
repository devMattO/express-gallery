const Express = require('express');

const Router = Express.Router();

const db = require('../models');

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/user/login');
  }
  return next();
}

Router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

Router.post('/', (req, res) => {
  db.Gallery.create({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description,
    UserId: req.user.id,
  })
  .then(() => res.redirect('/'))
  .catch(() => res.send({ success: false }));
});


Router.get('/', (req, res) => {
  db.Gallery.findAll()
  .then((data) => {
    if (req.user !== undefined) {
      return res.render('gallery/', {
        pics: data,
        main_pic: data[0],
        logged_in: true,
        user: req.user,
      });
    }
    return res.render('gallery/', {
      pics: data,
      main_pic: data[0],
      logged_in: false,
    });
  })
  .catch(() => res.render('404'));
});
Router.get('/new/', isAuthenticated, (req, res) => res.render('gallery/new_photo'));

Router.get('/vince', (req, res) => res.render('vince'));

Router.get('/matt', (req, res) => res.render('matt'));

Router.get('/:id', (req, res) => {
  db.Gallery.findById(req.params.id)
  .then((data) => {
    db.Gallery.findAll()
    .then((allData) => {
      if (data.dataValues.UserId === undefined || req.user === undefined) {
        return res.render('gallery/single_photo', {
          pic: data,
          pic1: allData[2],
          pic2: allData[1],
          UserId: 'no',
          GalleryId: false,
        });
      }
      if (req.user.role) {
        return res.render('gallery/single_photo', {
          pic: data,
          pic1: allData[2],
          pic2: allData[1],
          UserId: 'yes',
          GalleryId: 'yes',
          logged_in: true,
          user: req.user,
        });
      }
      return res.render('gallery/single_photo', {
        pic: data,
        pic1: allData[2],
        pic2: allData[1],
        UserId: req.user.id,
        GalleryId: data.dataValues.UserId,
        logged_in: true,
        user: req.user,
      });
    });
  })
  .catch(() => res.render('404'));
});

Router.get('/:id/edit', (req, res) => {
  db.Gallery.findById(req.params.id)
  .then((data) => res.render('gallery/edit_photo', {
    pics: data.dataValues,
  }))
  .catch(() => res.render('404'));
});

Router.put('/:id', (req, res) => {
  db.Gallery.update({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description,
  }, {
    where: { id: req.params.id },
  })
  .then(() => res.redirect('/'))
  .catch(() => res.render('404'));
});

Router.delete('/:id', (req, res) => {
  db.Gallery.destroy({ where: { id: req.params.id } })
  .then(() => res.redirect('/'))
  .catch(() => res.render('404'));
});

module.exports = Router;
