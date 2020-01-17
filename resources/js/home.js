import { randInt , toHundred } from './math.js'

// ===========
//  CONSTANTS
// ===========

// In this file, coordinates will be an array
// the first value is the X position
const X = 0;
// and the second value is the Y position
const Y = 1;


// ==================
//  GLOBAL VARIABLES
// ==================

// Global variable used to automatically save the player names when the user types them in
// Used in conjunction with the savePlayerName() function
var savedPlayerNames = ['','','',''];


// ===========
//  FUNCTIONS
// ===========



// Called when the "amount of players" buttons are pressed
function playerSelect(players) {
	// Opens the player-select div
	$('#player-select').css('flex', '1 1 0');
	$('#player-select').css('background-color', 'transparent');
	$('#player-select').children().css('opacity', '1');
	// Shrinks the blokus title
	$('#title').css('transform','scale(0.7)');

	// Fills the player-select div based on which button was pressed
	$('#player-select .h-flex').empty();
	switch(players) {
		case 2:
			$('#player-select-title').text("2 Players");
			$('#player-select .h-flex').addPlayer(2);
			break;
		case 3:
			$('#player-select-title').text("3 Players");
			$('#player-select .h-flex').addPlayer(3);
			break;
		case 4:
			$('#player-select-title').text("4 Players");
			$('#player-select .h-flex').addPlayer(4);
			break;
	}
}
window.playerSelect = playerSelect;

// Saves the player names when any text input is edited
function savePlayerName(num) {
	num = parseInt(num);
	let input = $(`.text-input[oninput="savePlayerName(${num})"]`);
	savedPlayerNames[num] = input.val();
}
window.savePlayerName = savePlayerName;

// Function to construct the upside-down trapezoid text boxes
function evenPlayerBox(num, color, hint) {
	let savedPlayerName = savedPlayerNames[num];
	return `
		<div class="px-3 mb-3 v-flex justify-content-start">
			<svg class="canvas" viewBox="0 0 60 60" preserveAspectRatio="none" style="fill:${color}">
				<polygon points="0,0,60,0,50,60,10,60"></polygon>
			</svg>
			<p class="display-2 font-teko p-1 mt-3">${num+1}</p>
			<input class="gradual-fast text-input" type="text" name="${hint}" 
			placeholder="${hint}" oninput="savePlayerName(${num})" value="${savedPlayerName}">
		</div>
	`;
}

// Function to construct the right-side-up trapezoid text boxes
function oddPlayerBox(num, color, hint) {
	let savedPlayerName = savedPlayerNames[num];
	return `
		<div class="px-3 mt-3 v-flex justify-content-end">
			<svg class="canvas" viewBox="0 0 60 60" preserveAspectRatio="none" style="fill:${color}">
				<polygon points="0,60,60,60,50,0,10,0"></polygon>
			</svg>
			<p class="display-2 font-teko p-1">${num+1}</p>
			<input class="gradual-fast text-input mb-3" type="text" name="${hint}"
			placeholder="${hint}" oninput="savePlayerName(${num})" value="${savedPlayerName}">
		</div>
	`;
}

// Creates a specified amount of trapezoid text boxes
// Used in conjunction with the playerSelect() function
$.fn.addPlayer = function(amount) {

	let colors = ['darkkhaki', 'green', 'darkred', 'darkslateblue'];
	let hints = ['Player Yellow', 'Player Green', 'Player Red', 'Player Blue'];

	for (let i = 0; i < amount; i++) {
		let color = colors.pop();
		let hint = hints.pop()

		// Alternates between upside-down and right-side-up trapezoids
		if (i%2) {
			$(this).append(oddPlayerBox(i,color,hint));
		}
		else {
			$(this).append(evenPlayerBox(i,color,hint));
		}
	}

}
	
// Rotates the blokus pieces in the background
// Takes a duration (in seconds) and an angle (in degrees) as parameters
$.fn.rotate = function(duration, angle) {

	// Get the current angle from the piece
	let currentAngle = parseInt($(this).attr('angle'));
	// Increase/decrease the current angle
	let newAngle = currentAngle + angle;
	// Set the new angle
	$(this).attr('angle', newAngle);
	
	// Rotate the piece
	$(this).css('transition', 'transform '+duration+'s');
	$(this).css('transform', 'rotate('+newAngle+'deg)');

	// Add a class to indicate that the piece is moving
	// This class is removed after the specified duration
	$(this).attr('inMotion', true);
	setTimeout(() => {$(this).removeAttr('inMotion')}, duration*1000);

}

// Randomly rotates the pieces (this function runs recursively, forever)
function rotatePieces() {

	setTimeout(function() {
		let odds = 50;
		$('svg').each(function() {
			if (!$(this).attr('inMotion') && randInt(0,odds) == 0) {
				let duration = randInt(25,40);
				let angle = [-270, -180, -90, 90, 180, 270][randInt(0,6)];
				$(this).rotate(duration, angle);
			}
		});
		rotatePieces();
	}, 500);

}
rotatePieces();


// ================
//	DOCUMENT READY
// ================

$(document).ready(function() {

	// Assign each piece a random color and a random position
	let fillColors = ['limegreen', 'red', 'yellow', 'slateblue'];
	let strokeColors = ['green', 'darkred', 'darkkhaki', 'darkslateblue'];
	let positions;
	//Different positions depending on the size of the screen
	if ($(document).width() < 1500) {
		positions = [
			[150,290],
			[650, 190],
			[1150, 90],
			[350, 590],
			[850, 590],
			[1350, 490]];
	}
	else {
		let w = $(document).width()/7;
		let h = $(document).height()/7;
		positions = [
			[toHundred(w)-50,   toHundred(h*3)-10],
			[toHundred(w*3)-50, toHundred(h*2)-10],
			[toHundred(w*5)-50, toHundred(h)-10],
			[toHundred(w*2)-50, toHundred(h*6)-10],
			[toHundred(w*4)-50, toHundred(h*5)-10],
			[toHundred(w*6)-50, toHundred(h*4)-10]];	
	}
	$('svg').each(function() {
		let i = randInt(0,4);
		let pos = positions.splice(randInt(0,positions.length),1);
		$(this).css({
			'fill' : fillColors[i], 
			'stroke' : strokeColors[i],
			'left' : pos[0][X],
			'top' : pos[0][Y]
		});
	});

	// Make all the children of the player-select div transparent initially
	$('#player-select').children().css('opacity', '0');

	// Listener for when the user moves the mouse cursor
	$(document).mousemove(function(event) {
		let ratio = 20;
		let dx = event.pageX/ratio;
		let dy = event.pageY/ratio;
		$('#bg-pieces').css({
			left: dx,
			top: dy
		})
	});

	// Listener for when the blokus title is clicked
	$('#title').click(function() {
		$('#player-select').css('flex', '0 1 0');
		$('#player-select').css('background-color', 'white');
		$('#player-select').children().css('opacity', '0');
		$('#title').css('transform','scale(1)');
	});

});