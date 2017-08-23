
//required node_modules
const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const parseurl = require('parseurl');
const fs = require('fs');
//set words into a variable to access dict/words file from computer and split
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
//create the express app
const app = express();

console.log(words);

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

//start by rendering mustache to page with the array for guessed letters
app.get('/', function(req, res){
  res.render('index', { guessArr:guessArr });
});

//each time a guess is made, the letters will be pushed onto the array and posted to the request body.
app.post('/', function(req, res){
  guessArr.push(req.body.guessBox);
  res.redirect('/');
});




//serve the page
app.listen(3000, function(){
  console.log("listening at port 3000!")
});
