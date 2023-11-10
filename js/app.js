document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	const flagsLeft = document.querySelector("#flags-left");
	const result = document.querySelector("#result");
	const timerElement = document.getElementById("timer");
	let width = 10;
	let bombAmount = 3;
	let flags = 0;
	let squares = [];
	let isGameOver = false;
	let timerInterval;
	let seconds = 0;
	let minutes = 0;

	// create board
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

			// normal click
			square.addEventListener("click", function (e) {
				click(square);
			});

			// right click
			square.oncontextmenu = function (e) {
				e.preventDefault();
				rightClick(square);
			};
		}
		// add numbers
		for (let i = 0; i < squares.length; i++) {
			let total = 0;
			const isLeftEdge = i % width === 0;
			const isRightEdge = i % width === width - 1;

			if (squares[i].classList.contains("valid")) {
				if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
				if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++;
				if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
				if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) total++;
				if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
				if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++;
				if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++;
				if (i < 89 && squares[i + width].classList.contains("bomb")) total++;
				if (i === 88 && squares[i + width + 1].classList.contains("bomb")) total++;
				if (i === 89 && squares[i + width].classList.contains("bomb")) total++;
				if (i === 98 && squares[i + 1].classList.contains("bomb")) total++;
				squares[i].setAttribute("data", total);
			}
		}
	}

	createBoard();

	flagsLeft.innerHTML = bombAmount;

	// right click function
	function rightClick(square) {
		if (isGameOver) return;
		if (!square.classList.contains("checked") || (square.classList.contains("flag") && flags < bombAmount)) {
			if (bombAmount - flags <= 0 && !square.classList.contains("flag")) {
				return;
			} else if (!square.classList.contains("flag")) {
				addFlag(square);
			} else {
				removeFlag(square);
			}
		}
	}

	// add flag function
	function addFlag(e) {
		e.classList.add("flag");
		e.innerHTML = "🚩";
		flags++;
		flagsLeft.innerHTML = bombAmount - flags;
		checkForWin();
	}
	// remove flag function
	function removeFlag(e) {
		e.classList.remove("flag");
		e.innerHTML = "";
		flags--;
		flagsLeft.innerHTML = bombAmount - flags;
	}

	// click on square action
	function click(square) {
		let currrentId = square.id;
		if (isGameOver) return;
		if (square.classList.contains("checked") || square.classList.contains("flag")) return;
		if (square.classList.contains("bomb")) {
			square.classList.add("detonated");
			GameOver(square);
		} else {
			let total = square.getAttribute("data");
			if (total != 0) {
				square.classList.add("checked");
				if (total == 1) square.classList.add("one");
				if (total == 2) square.classList.add("two");
				if (total == 3) square.classList.add("three");
				if (total == 4) square.classList.add("four");
				if (total == 5) square.classList.add("five");
				if (total == 6) square.classList.add("six");
				if (total == 7) square.classList.add("seven");
				if (total == 8) square.classList.add("eight");
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

	// timer
	grid.addEventListener("click", startTimer) || grid.addEventListener("contextmenu", startTimer);
	// grid.addEventListener("contextmenu", startTimer);

	function startTimer() {
		grid.disabled = true;
		grid.removeEventListener("click", startTimer);
		grid.removeEventListener("contextmenu", startTimer);
		timerInterval = setInterval(updateTimer, 1000);
		if (isGameOver == true) {
			clearInterval(timerInterval);
		}
	}

	function updateTimer() {
		seconds++;
		if (seconds === 60) {
			seconds = 0;
			minutes++;
		}
		const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
		timerElement.textContent = formattedTime;
	}

	// game over
	function GameOver(square) {
		result.innerHTML = "Boom! Game Over";
		isGameOver = true;
		clearInterval(timerInterval);

		// show all bombs
		squares.forEach((square) => {
			if (square.classList.contains("bomb")) {
				square.innerHTML = "💣";
				square.classList.remove("bomb");
				square.classList.add("checked");
			}
		});
	}

	// check for win
	function checkForWin() {
		let matches = 0;

		for (let i = 0; i < squares.length; i++) {
			if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
				matches++;
			}
			if (matches === bombAmount) {
				result.innerHTML = "You Win!";
				isGameOver = true;
				clearInterval(timerInterval);
			}
			if (isGameOver) {
				squares.forEach((square) => {
					if (square.classList.contains("valid")) {
						square.classList.add("checked");
					}
				});
			}
		}
	}
});
