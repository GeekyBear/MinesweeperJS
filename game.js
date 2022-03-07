document.addEventListener('DOMContentLoaded', () =>{
	const grid = document.querySelector('.grid')
	let width = 10
	let bombAmount = 10
	let flags = 0
	let squares = []
	let isGameOver = false

	// function click(clicked_id){
	// 	alert("You have pressed square: " + clicked_id);
	// }

	// Create board
	function createBoard() {
		// get shuffled game array with random bombs
		// This makes an array of 20 indexes (bombAmount)
		// using fill you add strings 'bomb'
		const bombsArray = Array(bombAmount).fill('bomb')
		// remaining 'safe' squares
		const emptyArray = Array(width*width - bombAmount).fill('valid')
		const gameArray = emptyArray.concat(bombsArray)
		shuffleArray(gameArray)

		for (var i = 0; i < width*width; i++) {
			// Create a hundred squares as 'div'
			const square = document.createElement('div')
			// Give to each square an id
			square.setAttribute('id', i)
			square.classList.add(gameArray[i])

			// Append child to grid
			grid.appendChild(square)
			// Push in the array
			squares.push(square)

			// Normal click
			square.addEventListener('click', function(e){
				click(square)
			})

			// Control and left click
			square.oncontextmenu = function(e){
				e.preventDefault()
				addFlag(square)
			}
		}

		// Add numbers
		for (var i = 0; i < squares.length; i++) {
			let total = 0
			// check if the square is in the left edge
			const isLeftEdge = (i % width === 0)
			// check if the square is in the right edge
			const isRightEdge = (i % width === width - 1)

			if(squares[i].classList.contains('valid')){
				// Check square in the left
				if(i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb'))
					total++
				// Check square in the right up
				if(i > 9 && !isRightEdge && squares[i+1-width].classList.contains('bomb'))
					total++
				// Check square in the top
				if(i > 10 && squares[i-width].classList.contains('bomb'))
					total++
				// Check square in the left and one up
				if(i > 11 && !isLeftEdge && squares[i-1-width].classList.contains('bomb'))
					total++
				// Check square in the right
				if(i < 98 && !isRightEdge && squares[i+1].classList.contains('bomb'))
					total++
				// Check square in the bottom left
				if(i < 90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb'))
					total++
				if(i < 88 && !isRightEdge && squares[i+1+width].classList.contains('bomb'))
					total++
				if(i < 89 && squares[i+width].classList.contains('bomb'))
					total++

				squares[i].setAttribute('data',total)
			}
		}
	}

	

 	/* Randomize array in-place using Durstenfeld shuffle algorithm */
	function shuffleArray(array) {
    	for (var i = array.length - 1; i > 0; i--) {
        	var j = Math.floor(Math.random() * (i + 1));
        	var temp = array[i];
        	array[i] = array[j];
        	array[j] = temp;
    	}
	}

	createBoard()

	// Add flag with right click
	function addFlag(square){
		if(isGameOver)
			return
		if(!square.classList.contains('checked') && (flags < bombAmount)){
			if(!square.classList.contains('flag')){
				square.classList.add('flag')
				square.innerHTML = '🚩'
				flags++
				checkForWin()
			}else{
				square.classList.remove('flag')
				square.innerHTML = ''
				flags--
			}
		}
	}

	// Click on square actions
	function click(square){
		let currentId = square.id
		if(isGameOver)
			return
		if(square.classList.contains('checked') || square.classList.contains('flag'))
			return
		if(square.classList.contains('bomb')){
			gameOver(square)
		} else {
			let total = square.getAttribute('data')
			if(total != 0){
				square.classList.add('checked')
				square.innerHTML = '<p>' + total + '</p>'
				return
			}
			checkSquare(square, currentId)
		}
		square.classList.add('checked')
	}


	// Check neighbouring squares once a square is clicked
	function checkSquare(square, currentId){
		const isLeftEdge = (currentId % width === 0)
		const isRightEdge = (currentId % width - 1)

		setTimeout (() =>{
			if (currentId > 0 && !isLeftEdge) {
				// Store the ID of the square next to our clicked square
				const newId = squares[parseInt(currentId) - 1].id
				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if (currentId > 9 && !isRightEdge){
				const newId = squares[parseInt(currentId) + 1 - width].id
				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if(currentId > 10){
				const newId = squares[parseInt(currentId - width)].id
				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if(currentId > 11 && !isLeftEdge){
				const newId = squares[parseInt(currentId) - 1 - width].id
				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if(currentId < 98 && !isRightEdge){
				const newId = squares[parseInt(currentId) + 1].id
				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if(currentId < 90 && !isLeftEdge){
				const newId = squares[parseInt(currentId) - 1 + width].id
				const newSquare = document.getElementById(newId)
				click(newSquare)
			}
			if(currentId < 88 && !isRightEdge){
				const newId = squares[parseInt(currentId) + 1 + width].id
				const newSquare = document.getElementById(newId)
				click(newSquare)
			}

			if(currentId < 89){
				const newId = squares[parseInt(currentId) + width].id
				const newSquare = document.getElementById(newId)
				click(newSquare)
			}

		}, 10)
	}

	// Game over
	function gameOver(square){
		console.log('BOOM! Game over')
		isGameOver = true

		// show all bomb location
		squares.forEach(square => {
			if(square.classList.contains('bomb')){
				square.innerHTML = '<p>💣</p>'
			}
		})
	}

	// Check for win
	function checkForWin() {
		let matches = 0
		for(let i = 0; i < squares.length; i++){
			if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
				matches++
			}

			if(matches === bombAmount){
				console.log('WIN!')
				isGameOver = true
			}
		}
	}
})