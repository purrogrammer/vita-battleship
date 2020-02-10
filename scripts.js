	
	// A 1D array of Cells to track position of vessels and places
	// where hits and misses have taken place;
    // Indices 0-99, so no need to deal with 3-digit case;
	// Initialized without number of elements specified; I didn't realize arrays were dynamic in JS vs. Java;
    var gameArray = [];

	// Our counters/accumulators:

	// I'm turning the following variables into Objects,
	// so that specific ships' location and hits can be tracked;
    var empty = 0;
    var hit = 1;
    var miss = -1;

	// Initialize global counters;
    var countTries = 0;
    var countMisses = 0;
    var countHits = 0;
	var shipsSunk = 0;

	// Our helper methods;

	// Generate a random number arbitrarily between 1 and 20;
	function genRandNum() {
		let randNum = Math.ceil(Math.random() * 20);
		return randNum;
	}

	// Use to determine whether a Ship is vertical or horizontally placed;
    function isOdd(num) {
	    if (num % 2 === 0) {
			return false;
        } else {
       		return true;
        }
    }

	// generates a random number between 1 and 20;
	// if number isOdd(), isVertical == true;
	function determineVertical() {
		return isOdd(genRandNum());
	}

	// A function to convert gameArray index to corresponding
	// (col, row) value;
	// Use for placing Ships;
	// Test: passed, returns expected values;
  	// Ironic: I may ultimately not need this at all.
	function convertIndexToCoords(index) {
		// Initialize (col, row) to dummy values;
		let col = -1;
		let row = -1;

		// Check whether a one-digit number or two;
		if(index < 10) {
			col = index;
			row = 0;
			// else: if index > 9;
		} else {
			// Convert index to a string;
      		// Had to change 'let' to 'var' to allow access outside of else{};
			var tempDex = index.toString();
			// Break said string into 2 components and convert to
			// base-10 Numbers;
      		// Grab second digit: this will be col (y-value);
			col = parseInt(tempDex.substring(1), 10);
      		// Grab first digit: this will be row (x-value);
			row = parseInt(tempDex.substring(0, 1), 10);
		}
    	// Returns Object contain our col (x-value) and row (y-value)
    	// corresponding to the index that was input;
		return {
	      col: col,
	      row: row,
	      index: index
    	};
	}

	// Function to convert (col, row) to index for searching for Ships
	// and checking user input;
	// Tested and working;
	function convertCoordsToIndex(col, row) {
		let strDex = col.toString().concat(row.toString());
		let index = parseInt(strDex, 10);
		return index;
	}

	// Create an Object constructor for the general Ship-type Object;
	// Ships contain info about their size (# of spaces they occupy),
	// name, a symbol to show where a hit has occurred, and when they
	// will sink (when hitPoints == 0);
    // Storing the data in an object instance will allow for the eventual
    // modification of the game to support a specified number of instances
    // of each vessel, a fun and challenging feature I want to add;
	function Ship(size, name, symbol) {

		// Size is number of spaces Ship occupies;
		this.size = size;
        var getSize = function() {
        	return this.size;
    	}
		// Name is a string of the type of vessel;
		this.name = name;
    	var getName = function() {
      		return this.name;
    	}
		// Symbol is an abbreviation for the vessel's name;
		// To be used for showing where hits have taken place.
		this.symbol = symbol;
    	var getSymbol = function() {
      		return this.symbol;
    	}

		// hitPoints initially equal to the number of spaces the Ship
		// occupies.
		let hitPoints = size;

    	// hitPoints tracks which individual vessels have been sunk;
		if(hitPoints == 0) {
			shipsSunk++;
      		alert("The " + this.name + " has been sunk!");
		}

		// If isOdd() returns true, isVertical == true;
		var isVertical = determineVertical();

		// A recursive function to determine if
	    // Ship can be placed at the corresponding element in gameArray;
		// Pass in the Ship it is checking for to place;
	    // This function also places the ships within the gameArray;
		function placeShip() {

	  		// If Ship is vertical:
	  		if(isVertical) {
				// Generate random X-coordinate;
				let col = Math.floor(Math.random()*9);
				// Generate random Y-coordinate between 0 and (10 - size);
				let row = Math.floor(Math.random()*(10 - getSize));
	  			// Increment the row to place Ship vertically;
	  			for(let i = getSize; i > 0; i--) {
					// Determine gameArray index corresponding to (col, row);
					let index = convertCoordsToIndex(col, row);
  					// If the space is unoccupied:
  					if(gameArray[index] == 0) {
    					// place the ship
    					gameArray[index] = getSymbol;
						// Update row to continue placing ship;
						row++;
					// Else: reset spaces to empty; try again;
  					} else {
			            // Reset any indices of gameArray to 0 to restart process;
			            for(let i = getSize; i > 0; i--) {
				            gameArray[index] = 0;
			                // Recursive case:
			                placeShip();
			                // Return to end this call in the callstack;
			                return;
		            	}
	  				}
	  			}
	  		// If Ship is horizontal:
	  		} else {
				// Generate random X-coordinate between 0 and (10 - size);
				let col = Math.floor(Math.random()*(10 - getSize));
				// Generate random Y-coordinate between 0 and 9;
				let row = Math.floor(Math.random()*9);
	  			// Increment the col to place Ship sideways;
	  			for(let i = getSize; i > 0; i--) {
					// Determine gameArray index corresponding to (col, row);
					let index = convertCoordsToIndex(col, row);
            		// If that space is available:
  					if(gameArray[index] == 0) {
  						// ...place the Ship;
  						gameArray[index] = getSymbol;
						// Update the column to place the ship;
						col++;
  					}
          			// Recursive case:
  					 else {
            			placeShip();
            			// Return to end this call in the callstack;
            			return;
            		}
	  			}
	  	    }
		    // Base case: exit function, having placed the ship in question;
		    return;
	}

	// The following instantiates the Ship objects representing each vessel;
	// The isOdd() function is being repurposed inside determineVertical()
    // to determine whether the vessel is to be placed vertically or
	// horizontally;
	// isOdd(): vertical;
	// !isOdd(): horizontal;

	// Instantiate Ship objects;
	var aircraftCarrier = new Ship(5, "aircraftCarrier", "2");
	var battleship = new Ship(4, "battleship", "3");
	var cruiser = new Ship(3, "cruiser", "4");
	var submarine = new Ship(3, "submarine", "5");
	var destroyer = new Ship(2, "destroyer", "6");

    // A function to initialize each of the Model's elements to 0,
	// representing an empty and unguessed element state;
    function initializeGameArray(gameArray) {
	    alert("initializeGameArray");
	    for(let i = 0; i < 100; i++) {
			   console.log(gameArray[i]);
	           gameArray[i] = 0;
    	}
	}

    // Set up game initially;
    initializeGameArray(gameArray);

	// Place our Ships on the board;
	aircraftCarrier.placeShip();
	battleship.placeShip();
	cruiser.placeShip();
	submarine.placeShip();
	destroyer.placeShip();

    dispgameArray();

    // getUpdateDisplay();  unnecessary, as GUESS button triggers this;
    // shipLocator(); unnecessary to this version, replaced by hasSpace;
    dispgameArray();
    dispBoard();
    //guess1 = getGuess();
    //updateGameArray(guess1);
    //dispgameArray();

// for(let i = 0; i < 10; i++) {
//     document.getElementById("part1").innerHTML = "XX XX XX XX XX" + "<br />";
//
// }
document.getElementById("part2").innerHTML = "<img src='water.png' alt='1' height='100' width='100'>" + "<br />";


	  // this is the display of the Model, the array tracking hits and misses
	  // and ship position;
    function dispgameArray() {

        // var i = 0; commented out as unnecessary;
        var html = "";

	    // Creates the array tracking ship positions and where hits/misses
	    // have occurred; need additional dimensions covered both in Model and
	    // visually in the View component;
        // Include handling for each type of vessel;
        // Tells how many Cells in gameArray have not been guessed at yet;
        alert((100 - countTries) + " unchecked spaces remaining in gameArray.");

        // This controls the display of the game;
		// alternatively: for(const Cell of gameArray){}
        for (col = 0; col < 10; col++) {
           for(row = 0; row < 10; row++) {
	            // Internally convert coords to index here:
	            let index = convertCoordsToIndex(col, row);

	            // Display empty Cells;
	            if (gameArray[index] == 0) {
	                if (isOdd(index)) {
	                    html = html + "X";
	                } else {
	                    html = html + "X ";
	                }
	            }
	            // Check if contains empty when fired upon;
	            if (gameArray[index] == -1){
	                if (isOdd(index)) {
	                    html = html + miss;
	                } else {
	                    html = html + miss + "  ";
	                }
	            }
	            if (gameArray[index] == 2) {
	                if (isOdd(index)) {
	                    html = html + aircraftCarrier.getSymbol;
	                } else {
	                  html = html + aircraftCarrier.getSymbol + "  ";
	                }
	            }
	            if (gameArray[index] == 3) {
	                if (isOdd(index)) {
	                    html = html + battleship.getSymbol;
	                } else {
	                    html = html + battleship.getSymbol + "  ";
	                }
	            }
	            if (gameArray[index] == 4) {
	                if (isOdd(index)) {
	                    html = html + cruiser.getSymbol;
	                } else {
	                    html = html + cruiser.getSymbol + "  ";
	                }
	            }
	            if (gameArray[index] == 5) {
	                if (isOdd(index)) {
	                    html = html + submarine.getSymbol;
	                } else {
	                    html = html + submarine.getSymbol + "  ";
	                }
	            }
	            if (gameArray[index] == 6) {
	                if (isOdd(index)) {
	                    html = html + destroyer.getSymbol;
	                } else {
	                    html = html + destroyer.getSymbol + "  ";
	                }
	            }
	            if (gameArray[index] == 1) {
	                if (isOdd(index)) {
	                  html = html + hit;
	                } else {
	                  html = html + hit + "  ";
	                }
	            }
        	}
        }
    document.getElementById("part3").innerHTML = html;
    }

    // get user's X-coordinate guess;
    function getGuessX() {
        alert("getGuessX");
        var guessIsBad = true;
        while (guessIsBad) {
            var guessX =  window.prompt("Enter your guess", "Number from 0 to 9");
            // alert(guessX);
            // alert(parseInt(guessX));
            if ((parseInt(guessX) >= 0 ) && (parseInt(guessX) <= 9)) {
              guessIsBad = false;
              // The following line is unnecessary, as this will break
              // out of while loop if (!guessIsBad) (i.e. if input is valid)
              // return parseInt(guessX);
            }
            alert("GuessX is bad? " + guessIsBad);
        }
        return parseInt(guessX);
    }

	  // get user's Y-coordinate guess;
	  function getGuessY() {
       alert("getGuessY");
       var guessIsBad = true;
       while (guessIsBad) {
           var guessY =  window.prompt("Enter your guess", "Number from 0 to 9");
           // alert(guessY);
           // alert(parseInt(guessY));
           if ((parseInt(guessY) >= 0 ) && (parseInt(guessY) <= 9)) {
              // Update 'countTries', incrementing by one, since at this point,
              // a valid X and Y guess has been made;
              countTries++;
              // Update guessIsBad to exit validation (while) loop;
              guessIsBad = false;
            }
           alert("guessY is bad?" + guessIsBad);
        }
        return parseInt(guessY);
    }

	// update data;
    // Will change data (symbol in gameArray), which will update the
    // appearance of the board;
    function updateGameArray(guessX, guessY) {
        alert("coordinates guessed:  (" + guessX + ", " + guessY + ")");
        let index = convertCoordsToIndex(guessX, guessY);
        if (gameArray[index] == empty) {
	        // Place 'miss' Ship object here to reflect a miss;
	        gameArray[index] == miss;
			countMisses++;
	    } else if(gameArray[index] == 2) {
	        aircraftCarrier.hitPoints--;
		} else if(gameArray[index] == 3) {
			battleship.hitPoints--;
		} else if(gameArray[index] == 4) {
			cruiser.hitPoints--;
		} else if(gameArray[index] == 5){
			submarine.hitPoints--;
		} else if(gameArray[index] == 6) {
			destroyer.hitPoints--;
		}
		// Mark element at 'index' to reflect a hit;
	    gameArray[index] = hit;
	    // Update the model and view, update global counters;
	    countHits++;
		countTries++;
    }



  	// the pretty pictures (updates the View);
    function dispBoard() {
        var html = "";
        // alert("disp Board");
        for (col = 0; col < 10; col++) {
          for (row = 0; row < 10; row++) {
            let index = convertCoordsToIndex(col, row);
			// If: empty;
            if (gameArray[index] == 0) {
                if (isOdd(index)){
                    html = html + "<a href=dispBoard()><img src='water.png' alt='1' height='25' width='25'></a>"
                }
                else
                {html = html + "<img src='water.png' alt='1' height='25' width='25'> "}
        // Handle case in which must begin new row;
		} else if(gameArray[index] == 0 && (col == 9)) {
                if (isOdd(index)){
                    html = html + "<a href=dispBoard()><img src='water.png' alt='1' height='25' width='25'></a><br>"
                } else {
					html = html + "<img src='water.png' alt='1' height='25' width='25'><br> "}
        }
            // If contains a miss;
            else if (gameArray[index] == miss) {
                if (isOdd(index)){
                    html = html + "<img src='miss.png' alt='1' height='25' width='25'>  "
                }
                else
                {html = html + "<img src='miss.png' alt='1' height='25' width='25'>  "}
            }
            // Start printing on new line when
            else if (gameArray[index] == miss && (col == 9)) {
                if (isOdd(index)){
                    html = html + "<img src='miss.png' alt='1' height='25' width='25'><br>  "
                }
                else
                {html = html + "<img src='miss.png' alt='1' height='25' width='25'><br>  "}
            }
            // If: is a hit when guessed;
            else if(gameArray[index] == hit) {
                if (isOdd(index)){
                    html = html + "<img src='hit.png' alt='1' height='25' width='25'>"
                }
                else
                {html = html + "<img src='hit.png' alt='1' height='25' width='25'>  "}
            }
            // Case in which must move to next line;
            else if(gameArray[index] == hit && (col == 9)) {
                if (isOdd(index)){
                    html = html + "<img src='hit.png' alt='1' height='25' width='25'>"
                }
                else
                {html = html + "<img src='hit.png' alt='1' height='25' width='25'>  "}
            }
          }
		}
		
        alert(html);
        document.getElementById("part1").innerHTML = html;
        document.getElementById("part5").innerHTML = "Tries - " + countTries + " Misses - " + countMisses + " Hits = " + countHits + "Ships sunk = " + shipsSunk;
        if (countTries > 8) {
           document.getElementById("part6").innerHTML = "The ships ESCAPED!"
        }
        else if(shipsSunk == 5) {
          document.getElementById("part6").innerHTML = "You sank the fleet of your nemesis.  Congratulations on your victory. "
		}
	}
        // if (countHits >= 3) { document.getElementById("part7").innerHTML = "You SUNK by Battleship!"}

		    // Get and validate user input;
	// Update the view;



	function getUpdateDisplay() {

		// Get user input;
		let guessX = getGuessX();
		let guessY = getGuessY();
		
		updateGameArray(guessX, guessY);
		dispgameArray();
		dispBoard();
	}
	document.addEventListener("click", getUpdateDisplay());
}
	
