// calling a function to hide parts of dom
newScreen("choices");
//init firebase
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
//setting up function that will hide and show correct parts of dom
function newScreen(arr1) {
  switch (arr1) {
    case "choices":
      $(".choices").show();
      $(".results").hide();
      break;

    case "results":
      if (player1) {
        database.ref(`/players/player1`).update({ playerData });
      } else if (player2) {
        database.ref(`/players/player2`).update({ playerData });
      }

      $(".results").show();
      $(".choices").hide();
      setTimeout(newScreen, 4000, "choices");
      break;
  }
}
// setting up object for player data
var playerData = {
  name: "",
  playerChoice: "",
  chat: "",
  playerHasChosen: false,
  wins: 0,
  losses: 0
};
//object for opponent
var opponentData = {
  name: "",
  playerChoice: "",
  playerHasChosen: false,
  wins: 0,
  losses: 0
};
var player;
var connectedRef = database.ref(".info/connected");
// variables for telling when player 1 is in the game
var player1 = false;
// variable for telling when player is in the game
var player2 = false;
// for making the first two users player 1 and player 2 and letting other players know all spots are taken.
connectedRef.on("value", function(snap) {
  if (snap.val()) {
    database.ref("/players").once("value", function(snapshot) {
      if (
        snapshot.child("player2").exists() &&
        !snapshot.child("player1").exists()
      ) {
        player = database.ref(`/players/player1/playerData`);
        database.ref(`/players/player1`).set({ playerData });
        player.onDisconnect().remove();
        player1 = true;

        // console.log(player);
      } else if (
        snapshot.child("player1").exists() &&
        !snapshot.child("player2").exists()
      ) {
        player = database.ref(`/players/player2/playerData`);
        database.ref(`/players/player2`).set({ playerData });

        player.onDisconnect().remove();
        player2 = true;

        // console.log(player);
      } else if (
        snapshot.child("player1").exists() &&
        snapshot.child("player2").exists()
      ) {
        alert("to many players try again later");
      } else {
        player = database.ref(`/players/player1/playerData`);
        database.ref(`/players/player1`).set({ playerData });

        player.onDisconnect().remove();
        player1 = true;

        // console.log(player);
      }
    });
  }
});
//event listener for watching for name input
$("#name-btn").on("click", function(event) {
  event.preventDefault();
  var name = $("#name").val();
  playerData.name = name;
  $("#name").val("");
  // console.log(player);

  $("#name-form").hide();
  // console.log(name);
  if (player1) {
    $("#player1-name").text(name);
    database.ref(`/players/player1`).update({ playerData });
  } else if (player2) {
    $("#player2-name").text(name);
    database.ref(`/players/player2`).update({ playerData });
  }
});
//event listener watching for game choice
$(".player-choice").on("click", function(event) {
  var choice = $(this).attr("data-value");
  playerData.playerChoice = choice;
  // setting key that player has made a choice once both are true it will check who won
  playerData.playerHasChosen = true;
  if (player1) {
    database.ref(`/players/player1`).update({ playerData });
  } else if (player2) {
    database.ref(`/players/player2`).update({ playerData });
  }
});
//event listener for changes to the database
database.ref(player).on("value", function(snapshot) {
  //updating text on dom to potray what is stored on the database
  $("#wins-player1").text(snapshot.val().players.player1.playerData.wins);
  $("#losses-player1").text(snapshot.val().players.player1.playerData.losses);
  $("#wins-player2").text(snapshot.val().players.player2.playerData.wins);
  $("#losses-player2").text(snapshot.val().players.player2.playerData.losses);
  $("#choice-player1").text(
    snapshot.val().players.player1.playerData.playerChoice
  );
  $("#choice-player2").text(
    snapshot.val().players.player2.playerData.playerChoice
  );
  $("choice-player1").text(
    `You picked ${snapshot.val().players.player1.playerData.playerChoice}!`
  );
  $("choice-player2").text(
    `You picked ${snapshot.val().players.player2.playerData.playerChoice}!`
  );
  newP = $("<p>");
  newP.text(snapshot.val().players.player2.playerData.chat);
  $("#chat").append(newP);

  newP = $("<p>");
  newP.text(snapshot.val().players.player1.playerData.chat);
  $("#chat").append(newP);
  playerData.chat = "";
  //if player 1 grabs player 2's details
  if (player1) {
    $("#player2-name").text(snapshot.val().players.player2.playerData.name);
    $("#player1-name").text(snapshot.val().players.player1.playerData.name);

    opponentData = {
      chat: snapshot.val().players.player2.playerData.chat,
      name: snapshot.val().players.player2.playerData.name,
      playerChoice: snapshot.val().players.player2.playerData.playerChoice,
      playerHasChosen: snapshot.val().players.player2.playerData
        .playerHasChosen,
      wins: snapshot.val().players.player2.playerData.wins,
      losses: snapshot.val().players.player2.playerData.losses
    };
    // if player 2 grabbing player 1's data
  } else if (player2) {
    $("#player2-name").text(snapshot.val().players.player2.playerData.name);
    $("#player1-name").text(snapshot.val().players.player1.playerData.name);

    opponentData = {
      chat: snapshot.val().players.player1.playerData.chat,
      name: snapshot.val().players.player1.playerData.name,
      playerChoice: snapshot.val().players.player1.playerData.playerChoice,
      playerHasChosen: snapshot.val().players.player1.playerData
        .playerHasChosen,
      wins: snapshot.val().players.player1.playerData.wins,
      losses: snapshot.val().players.player1.playerData.losses
    };
  }
  //once both players have choosen it will find the winner
  if (playerData.playerHasChosen && opponentData.playerHasChosen) {
    // debugger;
    if (playerData.playerChoice === opponentData.playerChoice) {
      $("#results-player1").text("You tied!");
      $("#results-player2").text("You tied!");
      playerData.playerChoice = "";
      playerData.playerHasChosen = false;

      newScreen("results");
    } else if (
      snapshot.val().players.player1.playerData.playerChoice === "rock"
    ) {
      if (snapshot.val().players.player2.playerData.playerChoice === "paper") {
        $("#results-player1").text("You lost!");
        $("#results-player2").text("You win!");
        if (player1) {
          playerData.losses++;
        } else if (player2) {
          playerData.wins++;
        }
        playerData.playerChoice = "";
        playerData.playerHasChosen = false;

        newScreen("results");
      } else if (
        snapshot.val().players.player2.playerData.playerChoice === "scissors"
      ) {
        $("#results-player1").text("You win!");

        $("#results-player2").text("You lose!");
        if (player1) {
          playerData.wins++;
        } else if (player2) {
          playerData.losses++;
        }

        playerData.playerChoice = "";
        playerData.playerHasChosen = false;
        newScreen("results");
      }
    } else if (
      snapshot.val().players.player1.playerData.playerChoice === "paper"
    ) {
      if (
        snapshot.val().players.player2.playerData.playerChoice === "scissors"
      ) {
        $("#results-player1").text("You lost!");
        $("#results-player2").text("You win!");
        if (player1) {
          playerData.losses++;
        } else if (player2) {
          playerData.wins++;
        }

        playerData.playerChoice = "";
        playerData.playerHasChosen = false;
        newScreen("results");
      } else if (
        snapshot.val().players.player2.playerData.playerChoice === "rock"
      ) {
        $("#results-player1").text("You win!");
        $("#results-player2").text("You lose!");
        if (player1) {
          playerData.wins++;
        } else if (player2) {
          playerData.losses++;
        }

        playerData.playerChoice = "";

        playerData.playerHasChosen = false;
        newScreen("results");
      }
    } else if (
      snapshot.val().players.player1.playerData.playerChoice === "scissors"
    ) {
      if (snapshot.val().players.player2.playerData.playerChoice === "rock") {
        $("#results-player1").text("You lost!");

        $("#results-player2").text("You win!");
        if (player1) {
          playerData.losses++;
        } else if (player2) {
          playerData.wins++;
        }

        playerData.playerChoice = "";
        playerData.playerHasChosen = false;
        newScreen("results");
      } else if (
        snapshot.val().players.player2.playerData.playerChoice === "paper"
      ) {
        $("#results-player1").text("You win!");
        $("#results-player2").text("You lose!");
        if (player1) {
          playerData.wins++;
        } else if (player2) {
          playerData.losses++;
        }

        playerData.playerChoice = "";
        playerData.playerHasChosen = false;

        newScreen("results");
      }
    }
  }
});
//event listener for grabbing chat
$("#chat-btn").on("click", function(event) {
  event.preventDefault();
  chat = $("#chat-input").val();

  if (player1) {
    database
      .ref(`/players/player1/playerData`)
      .update({ chat: `${playerData.name}: ${chat}` });
  } else if (player2) {
    database
      .ref(`/players/player2/playerData`)
      .update({ chat: `${playerData.name}: ${chat}` });
  }
  $("#chat-input").val("");
});
