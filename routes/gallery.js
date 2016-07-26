const Express = require('express');
const Router = Express.Router();
const fs = require('fs');
const db = require('../models');
const passport = require('passport');

Router.post('/gallery', (req, res) => {
  db.Gallery.create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
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

Router.get('/', (req, res) => {
  db.Gallery.findAll()
  .then ( (data) => {
    return res.render('gallery/', {
      pics: data,
      main_pic: data[1]
    });
  })
  .catch( _ => {
    return res.render('404');
  });
});
Router.get('/gallery/new/', (req, res) => {
  return res.render('gallery/new_photo');
});

Router.get('/gallery/vince', (req, res) => {
  return res.render('vince');
});

Router.get('/gallery/matt', (req, res) => {
  return res.render('matt');
});

Router.get('/gallery/:id', (req, res) => {
  db.Gallery.findById(req.params.id)
  .then( (data) => {
    db.Gallery.findAll()
    .then( (allData) => {
      return res.render('gallery/single_photo', {
        pic: data,
        pic1: allData[2],
        pic2: allData[1]
      });
    });
  })
  .catch ( err => {
    return res.render('404');
  });
});

Router.get('/gallery/:id/edit', (req, res) => {
  db.Gallery.findById(req.params.id)
  .then( (data) => {
    return res.render('gallery/edit_photo', {
      pics: data.dataValues
    });
  })
  .catch( err => {
    return res.render('404');
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
    db.Gallery.findAll()
    .then((data) => {
      return res.render('index', {
        pics: data,
        main_pic: data[1],
      });
    })
    .catch( err => {
      return res.render('404');
    });
  })
  .catch( err => {
    return res.render('404');
  });
});

Router.delete('/gallery/:id', (req, res) => {
  db.Gallery.destroy({ where: { id: req.params.id } })
  .then( _ => {
    db.Gallery.findAll()
    .then((data) => {
      console.log(data.length);
      return res.render('gallery/', {
        pics: data,
        main_pic: data[1],
      });
    })
    .catch( err => {
      return res.render('404');
    });
  })
  .catch( err => {
    return res.render('404');
  });
});

Router.get('/login', (req, res) => {
  return res.render('login');
});

// Router.post('/login',
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login'
//   }));

Router.get('/new_user', (req, res) => {
  return res.render('new_user');
});

Router.post('/new_user', (req, res) => {
  db.User.create({
      username: req.body.username,
      password: req.body.password,
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
module.exports = Router;