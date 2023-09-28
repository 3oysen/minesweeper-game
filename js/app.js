document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	let width = 10;
	let bombAmount = 20;
	let squares = [];

	//create board
	function createBoard() {
		const bombsArray = Array(bombAmount).fill("bomb");
		const emptyArray = Array(width * width - bombAmount).fill("valid");
		const gameArray = emptyArray.concat(bombsArray);
		const gameShuffled = gameArray.sort(() => Math.random() - 0.5);

		for (let i = 0; i < width * width; i++) {
			const square = document.createElement("div");
			square.setAttribute("id", i);
			grid.appendChild(square);
			squares.push(square);
		}
	}
	createBoard();
});
