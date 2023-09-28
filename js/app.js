document.addEventListener("DOMContentLoaded", () => {
	const grid = document.querySelector(".grid");
	let width = 10;
	let bombAmount = 20;
	let squares = [];

	//create board
	function createBoard() {
		const bombsArray = Array(bombAmount).fill("bomb");
		const emptyArray = Array(width * width - bombAmount).fill("valid");
		console.log(bombsArray);
		console.log(emptyArray);

		for (let i = 0; i < width * width; i++) {
			const square = document.createElement("div");
			square.setAttribute("id", i);
			grid.appendChild(square);
			squares.push(square);
		}
	}
	createBoard();
});
