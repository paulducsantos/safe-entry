var express           = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser        = require('body-parser');
var session           = require('express-session')
var Sequelize         = require('sequelize');
var app               = express();

const PORT = process.env.PORT || 8080;

var sequelize = new Sequelize('safe_entry', 'root', 'password');

app.use(bodyParser.urlencoded({extended: false}));
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING,
    validate: {
      is: ["^[a-z]+$",'i'],
      notEmpty: true
    }
  },
  phone_number: {
    type: Sequelize.INTEGER,
    validate: {
      isNumeric: true
    }
  },
  message: {
    type: Sequelize.TEXT,
    validate: {
      len: [5,500]
    }
  }
});

// app.use(session({
//   secret: 'elm i 8lsdjfklsjflkjsdfjsd',
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24 * 14
//   },
//   saveUninitialized: true,
//   resave: false
// }));

app.get('/', function(req, res) {
  res.render('index');
});

// app.get('/login', function(req, res) {
//   res.render('login');
// });

app.post('/newperson', function(req, res) {
  User.create(req.body).then(function(user) {
    res.redirect('/');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/fail');
  });
});

// app.post('/login', function(req, res) {
//   var email = req.body.email;
//   var password = req.body.password;

//   Person.findOne({
//     where: {
//       email: email,
//       password: password
//     }
//   }).then(function(user) {
//     if(user) {
//       req.session.authenticated = user;
//       res.redirect('/success');
//     } else {
//       res.redirect('/?msg=You failed at life');
//     }
//   }).catch(function(err) {
//     throw err;
//   });
// });

app.get('/fail', function(req, res) {
  res.render('fail');  
});

sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("LISTNEING!");
  });
});