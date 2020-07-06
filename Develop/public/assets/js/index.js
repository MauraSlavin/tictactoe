// html elements that need to be referenced
var $grid = $(".container .grid");
var $cell11 = $("#cell11");  
var $cell12 = $("#cell12");  
var $cell13 = $("#cell13");  
var $cell21 = $("#cell21");  
var $cell22 = $("#cell22");  
var $cell23 = $("#cell23");  
var $cell31 = $("#cell31");  
var $cell32 = $("#cell32");  
var $cell33 = $("#cell33"); 
var $cellxx = $(".cellxx"); 
var $cell11img = $("#cell11img");  
var $cell12img = $("#cell12img");  
var $cell13img = $("#cell13img");  
var $cell21img = $("#cell21img");  
var $cell22img = $("#cell22img");  
var $cell23img = $("#cell23img");  
var $cell31img = $("#cell31img");  
var $cell32img = $("#cell32img");  
var $cell33img = $("#cell33img");  
var $xWins = $("#xWins"); 
var $oWins = $("#oWins"); 
var $draws = $("#draws");
var $games = $("#games");



var initVars = function() {

  // $cell11img.attr('src', 'assets/o.png');
  // $cell11.attr('disabled', true);
  // $cell11.removeClass( "hover" );

  // $cell22img.attr('src', 'assets/x.png');
  // $cell22.attr('disabled', true);
  // $cell22.removeClass( "hover" );

  // possible values for winnerResults: "o", "x", "draw","notDone"
  var winnerResults = "notDone";
  var tictactoeGrid = [["","",""],["","",""],["","",""]];

  // to be read from JSON file in the future
  var oWins = 0;
  var xWins = 0;
  var draws = 0;
  var games = 0;

  // put these on the webpage
  $oWins.text(oWins.toString());
  $xWins.text(xWins.toString());
  $draws.text(draws.toString());
  $games.text(games.toString());

  return [tictactoeGrid, oWins, xWins, draws, games, winnerResults];

};  // of initVars

// Returns "o" if o won, "x" if x won, "draw" if it's a draw, or "notDone" to continue the game
var checkForWinner = function(grid) {

  // check for blank cells; if at least one found, assume game not done, unless winner found
  // if all blanks, return notDone
  var allBlanks = true;
  var winner = "draw";  // assume until found otherwise

  for (var row = 0; row < 3; row++) {
    for (var col = 0; col < 3; col++) {
      if (grid[row][col] == "") {
        winner = "notDone"
      } else {
        allBlanks = false;
      };   
      if (!allBlanks && winner=="notDone") break;  // no need to continue checking
    };
    if (!allBlanks && winner=="notDone") break;  // no need to continue checking
  };

  if (allBlanks) return "notDone"; // don't check for a winner if there are all blanks

  // check for row winner
  for (var row = 0; row < 3; row++) {
    if (grid[row][0] == grid[row][1] &&
        grid[row][1] == grid[row][2] &&
        grid[row][0] != "") {
          return grid[row][0];
        };
  };

  // check for column winner
  for (var col = 0; col < 3; col++) {
    if (grid[0][col] == grid[1][col] &&
        grid[1][col] == grid[2][col] &&
        grid[0][col] != "") {
          return grid[0][col];
        };
  };

  // check for diagonal winner
  if (((grid[0][0] == grid[1][1] && grid[1][1] == grid[2][2]) ||
      (grid[0][2] == grid[1][1] && grid[1][1] == grid[2][0])) &&
      grid[1][1] != "") {
        return grid[1][1];
      };

  return winner;
  
};  // checkForWinner

// for testing MMS
var test = function(grid) {
  var winner = checkForWinner(grid);
  console.log("Grid: " + grid + ";  Winner: " + winner);
};

// deleted initializing activeNote
// used to keep track of whether you are editting an existing note,
// or creating a new note.  
// true means an existing note is being editted; 
// false means a new note is being created
// var editMode = false; 

// A function for getting all notes from the db file
var getScore = function() {
  return $.ajax({
    url: "/api/notes",  // url and method must match path & function in notetaker.js
    method: "GET"
  });
};

// A function for saving a note to the db file
var saveNote = function(note) {

  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// A function for updating a note to the db file
var updateNote = function(note) {
  return deleteNote(note.id)
  .then(function() {
    saveNote(note);
  });
};

// A function for deleting a note from the db file
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function() {

  $saveNoteBtn.hide();  // only show save button when changes have been made to save

// display the note if it exists; 
// it can only be editted if editMode is true (meaning an existing note is being editted), 
// or if there is no active note
  if (activeNote.id) {
    if (editMode) {
      $noteTitle.attr("readonly", false);
      $noteText.attr("readonly", false);
    } else {
      $noteTitle.attr("readonly", true);
      $noteText.attr("readonly", true);
    };
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Random id generator based on code from
//    https://stackoverflow.com/questions/23327010/how-to-generate-unique-id-with-node-js
function generate() {
  // characters to choose from
  const _sym = "abcdefghijklmnopqrstuvwxyz1234567890";
  var str = "";
  const numChar = 10;
// concatenate one random character at a time to the string to be returned
  for (var i = 0; i < numChar; i++) {
    str += _sym[parseInt(Math.random() * _sym.length)];
  }

  return str;
}

// Handle click on a cell
var handleClick = function(event) {
  event.stopPropagation();
  console.log("In handleClick");
  var cellxx = $(this)
    .data();
  console.log(cellxx);

};  // of handleClick function


// Get the note data from the inputs, save it to the db file and update the view
var handleNoteSave = function() {

  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  if (editMode) {
    newNote.id = activeNote.id;
    updateNote(newNote).then(function(data) {
      activeNote = {};  // reset - no active note
      editMode = false;  // not editting a current note
      getAndRenderNotes();
      renderActiveNote();
      handleRenderSaveBtn();
    });
  } else {
    newNote.id = generate();
    saveNote(newNote).then(function(data) {
      getAndRenderNotes();
      renderActiveNote();
      handleRenderSaveBtn();
    });
  };
  alert('"' + newNote.title + '" saved.');
};

// edit the clicked note
var handleNoteEdit = function(event) {
// prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  activeNote = $(this)
    .parent(".list-group-item")
    .data();

  editMode = true;  // since current note is being editted
  renderActiveNote();
  handleRenderSaveBtn();
};

// Delete the clicked note
var handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

// de-activate the note if the active one is the one being deleted
  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
    handleRenderSaveBtn();
  });
    alert('"' + note.title + '" deleted.');
};

// Sets the activeNote and displays it
var handleNoteView = function() {
  editMode = false;
  activeNote = $(this)
    .parent(".list-group-item")
    .data();
  renderActiveNote();
  handleRenderSaveBtn();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
  handleRenderSaveBtn();
};

// The save button should be displayed ...
// Must be non-blanks in both title and text
// If editMode is on, (editting an existing note)
// or if editMode is off AND 
//    there is no active note  (this is a new note)
// Otherwise, the button is hidden
//    (either displaying an existing note that is not edittable
//    or creating a new note that doesn't have both a title and text yet)
var handleRenderSaveBtn = function() {
  // isActiveNoteEmpty is true if there is no active note
  var isActiveNoteEmpty = !Object.keys(activeNote).length; 

  if (
    ($noteTitle.val().trim() && $noteText.val().trim()) &&
    (
      (editMode) ||
      (isActiveNoteEmpty) 
    ))
  {
    $saveNoteBtn.show();
  } else {
    $saveNoteBtn.hide();
  }
};

// Render's the list of note titles
var renderNoteList = function(notes) {
  // clean out the note list
  $noteList.empty();
  var noteListItems = [];

// for each note, build the html li and append it.
  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    // note title
    var $span = $(`<span class='display-note keyId' data-id='${note.id}'>`).text(note.title);
    // edit button
    var $editBtn = $(
      `<i class='fas fa-pen float-right edit-note keyId' data-id='${note.id}'>`
    );
    // delete button
    var $delBtn = $(
      `<i class='fas fa-trash-alt float-right text-danger delete-note keyId' data-id='${note.id}'>`
    );

    // put it all together
    $li.append($span, $delBtn, $editBtn);
    // and push it to the array of list items for each note
    noteListItems.push($li);
  }
// append the list of notes to the list in the html
  $noteList.append(noteListItems);
};

// Gets notes from the db file and renders them to the sidebar
var getAndRenderNotes = function() {
  return getScores().then(function(data) {
    renderNoteList(data);
  });
};

// Initialize global variables
var tictactoeGrid, oWins, xWins, draws, games, winnerResults;
[tictactoeGrid, oWins, xWins, draws, games, winnerResults] = initVars();

// for testing
// var grid = [["x","x","x"],["","",""],["","",""]]; // MMS test; x wins
// test(grid);  // MMS test
// var grid = [["o","o","o"],["","",""],["","",""]]; // MMS test; o wins
// test(grid);  // MMS test
// var grid = [["o","","o"],["","",""],["","",""]]; // MMS test; incomplete
// test(grid);  // MMS test
// var grid = [["o","","x"],["","o",""],["","","o"]]; // MMS test; diagonol
// test(grid);  // MMS test
// var grid = [["o","o","x"],["x","x","o"],["o","x","x"]]; // MMS test; draw
// test(grid);  // MMS test

// listen for any click event that needs to be handled.
$grid.on("click", ".cellxx", handleClick);

winnerResults = checkForWinner(tictactoeGrid);
// $saveNoteBtn.on("click", handleNoteSave);   // Save a note
// $noteList.on("click", ".display-note", handleNoteView);  // View a selected note
// $newNoteBtn.on("click", handleNewNoteView);           // Start a new note
// $noteList.on("click", ".delete-note", handleNoteDelete);  // delete a note
// $noteList.on("click", ".edit-note", handleNoteEdit);  // edit a note
// $noteTitle.on("keyup", handleRenderSaveBtn);   // display save button
// $noteText.on("keyup", handleRenderSaveBtn);    // display save button

// // Gets and renders the initial list of notes
// getAndRenderNotes();
// handleRenderSaveBtn();