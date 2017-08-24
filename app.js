
//required node_modules
const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const parseurl = require('parseurl');
const fs = require('fs');
const form = require('express-form');
const flash = require('connect-flash');
const field = form.field;
//set words into a variable to access dict/words file from computer and split
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
//create the express app
const app = express();


//set an arrary for the guessed letters
let guessArr = [];
//randomly generated word
let randomWord = "";
//line blanks
let results = [];

let invalidArr = [];


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

//this  will generate a random word from 'words' variable
   randomWord = words[Math.floor(Math.random()* words.length)];

  //this will take that word and break it up into separate letters
  let randomLetters = [...randomWord];
  //this replaces the commas with spaces
  let randomSpaces = randomLetters.join(" ");


//loop through the random word and give it a _ instead of letters
  for (let i = 0; i < randomWord.length; i ++) {
    results.push('_');
  };

//formats the underscores to have spaces and no commas
  let resultsFormat = results.join(" ");





//start by rendering mustache to page with the array for guessed letters
app.get('/', function(req, res){
  res.render('index', { guessArr , resultsFormat , randomWord });
});

//set end game page to render endgame.mustache file
app.get('/endgame', function(req, res){
  res.render('endgame');
});

//when play again button is clicked, user is redirected to index
app.post('/endgame', function(req, res){
  res.redirect('/');
})

//tell the guessbox that we only want letters. If that doesn't happen, console the error
app.post('/', form(
field("guessBox").trim().required().is(/^[a-zA-Z]+$/)
), function(req, res, next){
  if(req.form.isValid){
    guessArr.push(req.body.guessBox)
  }
  res.redirect('/')
  //makes the middleware move to next post
  next();
});

//each time a guess is made, the letters will be pushed onto the array and posted to the request body.



//serve the page
app.listen(3000, function(){
  console.log("listening at port 3000!")
});
