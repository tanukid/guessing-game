function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function () {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function (guess) {
  if (isNaN(guess) || guess < 1 || guess > 100) throw 'That is an invalid guess.';
  this.playersGuess = guess;
  return this.checkGuess(guess);
}

Game.prototype.checkGuess = function (guess) {
  if (guess === this.winningNumber) return 'You Win!';
  if (this.pastGuesses.includes(guess)) return 'You have already guessed that number.';
  this.pastGuesses.push(guess);
  if (this.pastGuesses.length === 5) return 'You Lose.';
  if (this.difference() < 10) return "You're burning up!";
  if (this.difference() < 25) return "You're lukewarm.";
  if (this.difference() < 50) return "You're a bit chilly.";
  return "You're ice cold!";
}

Game.prototype.provideHint = function () {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}

/**
 * Utility functions
 */
function newGame() {
  return new Game();
}

function generateWinningNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

function shuffle(array) {
  let m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

/**
 * DOM manipulation
 */
$(document).ready(function () {
  let game = new Game();

  $('#submit').on('click', () => submit(game))

  $('#player-input').keypress((e) => {
    if (e.key === 'Enter') submit(game);
  })

  $('#reset').on('click', () => {
    game = newGame();
    $('#hint, #submit').prop("disabled", false);
    $('#title').text('Play the Guessing Game!')
    $('#subtitle').text('Guess a number between 1-100!')
    $('.guess').text('-')
  })

  $('#hint').on('click', () => {
    $('#title').text(game.provideHint().join(', '));
  })
});

function submit(game) {
  const guess = +$('#player-input').val();
  endGameIfOver(guess, game);
  $('#player-input').val('');
  var output = game.playersGuessSubmission(guess);
  if (output === 'You have already guessed that number.') {
    $('#title').text(output + ' Please try again.');
  } else {
    $('#title').text((guess === game.winningNumber ? 'Great job! ' + guess + ' is the correct number.' : '') + output);
    if (guess != game.winningNumber) $('#guess-list li:nth-child(' + game.pastGuesses.length + ')').text(game.playersGuess);
  }
}

function endGameIfOver(guess, game) {
  if (!isNaN(guess) && !game.pastGuesses.includes(guess) && (game.pastGuesses.length === 4 || guess === game.winningNumber)) {
    $('#subtitle').text('Press reset button to play again.')
    $('#hint, #submit').prop("disabled", true);
  }
}