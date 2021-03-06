
//required node_modules
const express = require('express');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const parseurl = require('parseurl');
const path = require('path');
const fs = require('fs');
//set words into a variable to access dict/words file from computer and split
//const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const words = [
  'mystery',
  'spooky',
  'ghost',
  'investigate',
  'haunted',
  'afraid',
  'frightening',
  'ghoul',
  'skeleton',
  'werewolf',
  'witch',
  'zombie',
  'eerie',
  'creepy',
  'casket',
  'cauldron',
  'gory',
  'unnerving',
  'tombstone',
  'spirits',
  'fangs',
  'howl',
  'coffin',
  'skull',
  'macabre',
  'phantom',
  'goblin',
  'cackle',
  'vampire'
 ];
//create the express app
const app = express();



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

app.get('/', function(req,res){
  res.render('start');
})

//start by rendering mustache to page with the array for guessed letters
app.get('/play', function(req, res){
  if (req.session.newGame || req.session.newGame === undefined ){
    console.log(words);
    //this  will generate a random word from 'words' variable
       req.session.randomWord = words[Math.floor(Math.random()* words.length)];
    //this will take that word and break it up into separate letters
       req.session.randomLetters = [...req.session.randomWord];
      //this replaces the commas with spaces
       req.session.randomSpaces = req.session.randomLetters.join(" ");
      //loop through the random word and give it a _ instead of letters
          req.session.results = [];
          req.session.guessArr = [];
          req.session.livesRemain = 8;
         for(i = 0; i < req.session.randomWord.length; i ++) {
          req.session.results.push('_');
        };
      //formats the underscores to have spaces and no commas
        req.session.resultsFormat = req.session.results.join(" ");
        req.session.newGame = false;
  }
  res.render('index', { guessArr:req.session.guessArr , resultsFormat:req.session.resultsFormat , randomWord:req.session.randomWord , livesRemain:req.session.livesRemain});
});

//set end game page to render endgame.mustache file
app.get('/winner', function(req, res){
  res.render('endgame', {randomWord:req.session.randomWord});
});

app.get('/loser', function(req,res){
  res.render('endgame', {randomWord:req.session.randomWord});
})
//when play again button is clicked, user is redirected to index
app.post('/endgame', function(req, res){
  req.session.newGame = true;
  res.redirect('/play');
})

//push the validated guesses to the array (shows up on page under letters guessed)
app.post('/play', function(req, res){
  let playerGuess = req.body.guessBox;
  if (req.session.guessArr.includes(playerGuess)) {
    return res.redirect('/play');
  }
  req.session.guessArr.push(playerGuess);

//function that checks if the guessed letter is in the word
  function isMatch() {
    if (req.session.randomLetters.includes(playerGuess)){
      for (i = 0; i < req.session.randomLetters.length; i ++){
        if (playerGuess === req.session.randomLetters[i]){
          req.session.results[i] = playerGuess;
        }
      }

      req.session.resultsFormat = req.session.results.join(" ");
      return true;
    } else {
      //decreases lives on incorrect guess
      req.session.livesRemain += -1
      return false;
    }
  }

//function that checks if game has been won
  function isWinner(){
    if ( JSON.stringify(req.session.results) == JSON.stringify(req.session.randomLetters) ){
      return true;
    }
  }
  isMatch();

//if lives is at zero or winner function true, end the game
  if (req.session.livesRemain === 0){
    res.redirect('/loser');
  } else if (isWinner()) {
    res.redirect('/winner');
  } else{
    res.redirect('/play');
  }
});

//serve the page
app.listen(process.env.PORT || 8000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
