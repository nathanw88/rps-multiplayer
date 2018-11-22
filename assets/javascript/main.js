// init firebase
var config = {
  apiKey: "AIzaSyDDRK27AeIyKMT5LMUdnBptTZCcA4VMtME",
  authDomain: "rps-multiplayer-b0c5d.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-b0c5d.firebaseio.com",
  projectId: "rps-multiplayer-b0c5d",
  storageBucket: "rps-multiplayer-b0c5d.appspot.com",
  messagingSenderId: "452372314745"
};
firebase.initializeApp(config);

var database = firebase.database();

//grab user name from input if no player1 set player one to true

//grab user name from input if there is a player 1 and no player 2 set player 2 to true and and set name

//else add to viewers

//when player one or two quits allow another player to take their place reset wins and loses

//grab R,P,S value from player1 button click

//grab R,P,S value from player2 button click

// when both values have changed then display choices and winner and change win and lose vaules for both players

//go back to start of game a few seconds after the end

//save comments to firebase

//display comments on page load

//have button to reset comments
