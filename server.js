var express           = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser        = require('body-parser');
var mysql             = require('mysql');
var session           = require('express-session')
var Sequelize         = require('sequelize');
var app               = express();

const PORT = process.env.PORT || 8080;

var sequelize = new Sequelize('Persons', 'root', 'password');

app.use(bodyParser.urlencoded({extended: false}));
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var Person = sequelize.define('Person', {
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: Sequelize.STRING,
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  favfood: Sequelize.STRING,
  age: Sequelize.INTEGER
});

app.use(session({
  secret: 'elm i 8lsdjfklsjflkjsdfjsd',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14
  },
  saveUninitialized: true,
  resave: false
}));

app.get('/', function(req, res) {
  res.render('register');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/register', function(req, res) {
  Person.create(req.body).then(function(user) {
    console.log(user);
    req.session.authenticated = user;
    res.redirect('/success');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/?msg=' + err.message);
  });
});

app.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  Person.findOne({
    where: {
      email: email,
      password: password
    }
  }).then(function(user) {
    if(user) {
      req.session.authenticated = user;
      res.redirect('/success');
    } else {
      res.redirect('/?msg=You failed at life');
    }
  }).catch(function(err) {
    throw err;
  });
});

app.get('/success', function(req, res) {
  if(req.session.authenticated) {
    res.render('success');  
  } else {
    res.redirect('/');
  }
  
});

sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("LISTNEING!");
  });
});