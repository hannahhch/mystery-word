
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

let randomLetters = [];
//set an arrary for the guessed letters
let guessArr = [];
//randomly generated word
let randomWord = "";
//line blanks
let results = [];
let randomSpaces = "";
let livesRemain = 8;
let resultsFormat = "";
let newGame = true;

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
  if (newGame){
    //this  will generate a random word from 'words' variable
       randomWord = words[Math.floor(Math.random()* words.length)];

      //this will take that word and break it up into separate letters
       randomLetters = [...randomWord];
      //this replaces the commas with spaces
       randomSpaces = randomLetters.join(" ");

      //loop through the random word and give it a _ instead of letters
         for(i = 0; i < randomWord.length; i ++) {
          results.push('_');
        };

      //formats the underscores to have spaces and no commas
      resultsFormat = results.join(" ");

        newGame = false;
  }
  res.render('index', { guessArr , resultsFormat , randomWord , livesRemain});
});

//set end game page to render endgame.mustache file
app.get('/endgame', function(req, res){
  res.render('endgame');
});

//when play again button is clicked, user is redirected to index
app.post('/endgame', function(req, res){
  newGame = true;
  res.redirect('/');
})

//push the validated guesses to the array (shows up on page under letters guessed)
app.post('/', function(req, res){
  guessArr.push(req.body.guessBox);
  let playerGuess = req.body.guessBox;
  function isMatch() {
    if (randomLetters.includes(playerGuess)){
      for (i = 0; i < randomLetters.length; i ++){
        if (playerGuess === randomLetters[i]){
          results[i] = playerGuess;
        }
      }
      resultsFormat = results.join(" ");
      return true;

    } else {
      //decreases lives on incorrect guess
      livesRemain += -1
      return false;
    }
  }
  if (livesRemain === 1) {
    livesRemain = 9;
    guessArr = [];
    results = [];
    res.redirect('/endgame');
  } else{
    res.redirect('/');
  }
isMatch();

});



//serve the page
app.listen(3000, function(){
  console.log("listening at port 3000!")
});
