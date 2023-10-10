document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	let width = 10;
	let bombAmount = 20;
	let squares = [];
	let isGameOver = false;

	//create board
	function createBoard() {
		const bombsArray = Array(bombAmount).fill("bomb");
		const emptyArray = Array(width * width - bombAmount).fill("valid");
		const gameArray = emptyArray.concat(bombsArray);
		const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

		for (let i = 0; i < width * width; i++) {
			const square = document.createElement("div");
			square.setAttribute("id", i);
			square.classList.add(shuffledArray[i]);
			grid.appendChild(square);
			squares.push(square);

			//normal click
			square.addEventListener("click", function (e) {
				click(square);
			});
		}
		// add numbers
		for (let i = 0; i < squares.length; i++) {
			let total = 0;
			const isLeftEdge = i % width === 0;
			const isRightEdge = i % width === width - 1;

			if (squares[i].classList.contains("valid")) {
				if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++; // W
				if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++; // NE
				if (i > 10 && squares[i - width].classList.contains("bomb")) total++; // N
				if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) total++; //NW
				if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++; // SE
				if (i < 89 && squares[i + width].classList.contains("bomb")) total++; // S
				if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++; // SW
				if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++; // E

				squares[i].setAttribute("data", total);
			}
		}
	}

	createBoard();

	// click on square action
	function click(square) {
		let currrentId = square.id;
		if (isGameOver) return;
		if (square.classList.contains("checked") || square.classList.contains("flag")) return;
		if (square.classList.contains("bomb")) {
			GameOver(square);
		} else {
			let total = square.getAttribute("data");
			if (total != 0) {
				square.classList.add("checked");
				square.innerHTML = total;
				return;
			}
			checkSquare(square, currrentId);
		}
		square.classList.add("checked");
	}

	// check the neighboring square
	function checkSquare(square, currrentId) {
		const isLeftEdge = currrentId % width === 0;
		const isRightEdge = currrentId % width === width - 1;

		setTimeout(() => {
			if (currrentId > 0 && !isLeftEdge) {
				const newId = squares[parseInt(currrentId) - 1].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currrentId > 9 && !isRightEdge) {
				const newId = squares[parseInt(currrentId) + 1 - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currrentId > 10) {
				const newId = squares[parseInt(currrentId) - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currrentId > 11 && !isLeftEdge) {
				const newId = squares[parseInt(currrentId) - 1 - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currrentId < 88 && !isRightEdge) {
				const newId = squares[parseInt(currrentId) + 1 + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currrentId < 89) {
				const newId = squares[parseInt(currrentId) + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currrentId < 90 && !isLeftEdge) {
				const newId = squares[parseInt(currrentId) - 1 + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currrentId < 98 && !isRightEdge) {
				const newId = squares[parseInt(currrentId) + 1].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
		}, 10);
	}

	// game over
	function GameOver(square) {
		console.log("game over");
		isGameOver = true;

		// show all bombs
		squares.forEach((square) => {
			if (square.classList.contains("bomb")) {
				square.innerHTML = "💣";
			}
		});
	}
});
