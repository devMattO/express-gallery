const Express = require('express');
const Router = Express.Router();
const fs = require('fs');
const db = require('../models');
const passport = require('passport');
const bcrypt = require('bcrypt');

function isAuthenticated (req, res, next){
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  return next();
}

const saltRounds = 10;

Router.get('/logout', (req,res)=>{
  req.logout();
  res.redirect('/');
});

Router.post('/gallery', (req, res) => {
  db.Gallery.create({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description,
      UserId: req.user.id
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
    if(req.user !== undefined){
      return res.render('gallery/', {
        pics: data,
        main_pic: data[1],
        logged_in: true,
        user: req.user,
      });
    } else {
      return res.render('gallery/', {
        pics: data,
        main_pic: data[1],
        logged_in: false
      });
    }
  })
  .catch( _ => {
    return res.render('404');
  });
});
Router.get('/gallery/new/', isAuthenticated, (req, res) => {
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
      if(data.dataValues.UserId == undefined || req.user == undefined){
        return res.render('gallery/single_photo', {
          pic: data,
          pic1: allData[2],
          pic2: allData[1],
          UserId: 'no',
          GalleryId: false
        });
      }
      if(req.user.role){
        return res.render('gallery/single_photo', {
          pic: data,
          pic1: allData[2],
          pic2: allData[1],
          UserId: 'yes',
          GalleryId: 'yes',
          logged_in: true,
          user: req.user
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
      console.log(data);
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

