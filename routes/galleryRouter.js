const Express = require('express');
const Router = Express.Router();
const fs = require('fs');
const db = require('../models');

Router.post('/gallery', (req, res) => {
  db.Gallery.create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
    })
  .then ( _ => {
    return res.status(200).send({'success': true});
  })
  .catch( err => {
    return res.send({'success': false});
  });
});

Router.get('/', (req, res) => {
  db.Gallery.findAll()
  .then ( (data) => {
    return res.render('../templates', {
      pics: data
    });
  });
});
Router.get('/gallery/new/', (req, res) => {
  return res.render('../templates/newPhotoForm');
});

Router.get('/gallery/:id', (req, res) => {
  db.Gallery.findById(req.params.id)
  .then( (data) => {
    return res.render('../templates/singlePhoto', {
      pics: data.dataValues
    });
  })
  .catch ( err => {
    return res.send({'success': false});
  });
});

Router.get('/gallery/:id/edit', (req, res) => {
  db.Gallery.findById(req.params.id)
  .then( (data) => {
    return res.render('../templates/editPhotoForm', {
      pics: data.dataValues
    });
  })
  .catch( err => {
    return res.send({'success': false});
  });
});

Router.put('/gallery/:id', (req, res) => {
  db.Gallery.update({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  }, {
    where: {id: req.params.id}
  })
  .then( _ => {
    return res.status(200).send({'success': true});
  })
  .catch( err => {
    return res.send({'success': false});
  });
});

Router.delete('/gallery/:id', (req, res) => {
  db.Gallery.destroy({ where: { id: req.params.id } })
  .then( _ => {
  return res.status(200).send({'success': true});
  })
  .catch( err => {
    return res.send({'success': false});
  });
});

module.exports = Router;