
//required node_modules
const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const parseurl = require('parseurl');

//create the express app
const app = express();

//set an arrary for the guessed letters
let guessArr = [];

//set app to use mustache-express
app.engine('mustache', mustache());
app.set('views', './views')
app.set('view engine', 'mustache')

//gets CSS
app.use(express.static(__dirname + '/public'));

//set the app to use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//start the session
app.use(session({
  secret: "12948109248",
  resave: false,
  saveUninitialized: true
}));

//start by rendering mustache to page
app.get('/', function(req, res){
  res.render('index', { guessArr:guessArr });
});

app.post('/', function(req, res){
  guessArr.push(req.body.guessBox);
  res.redirect('/');
});




//serve the page
app.listen(3000, function(){
  console.log("listening at port 3000!")
});
