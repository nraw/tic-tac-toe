import React, { useState, useEffect } from "react";

const TicTacToeDice = () => {
	// Game state
	const [board, setBoard] = useState(Array(9).fill({}));
	const [currentPlayer, setCurrentPlayer] = useState(1); // Player 1 or 2
	const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'win', 'draw'
	const [winner, setWinner] = useState(null);
	const [winningLine, setWinningLine] = useState([]);

	// Player dice inventory
	const [playerDice, setPlayerDice] = useState({
		1: { normal: 9, special: { 4: 1, 5: 1, 6: 1 } },
		2: { normal: 9, special: { 4: 1, 5: 1, 6: 1 } },
	});

	// Selected dice type and value
	const [selectedDiceType, setSelectedDiceType] = useState("normal");
	const [selectedDiceValue, setSelectedDiceValue] = useState(null);

	// Winning combinations
	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8], // Rows
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8], // Columns
		[0, 4, 8],
		[2, 4, 6], // Diagonals
	];

	// Reset game
	const resetGame = () => {
		setBoard(Array(9).fill({}));
		setCurrentPlayer(1);
		setGameStatus("playing");
		setWinner(null);
		setWinningLine([]);
		setSelectedDiceType("normal");
		setSelectedDiceValue(null);
		setPlayerDice({
			1: { normal: 9, special: { 4: 1, 5: 1, 6: 1 } },
			2: { normal: 9, special: { 4: 1, 5: 1, 6: 1 } },
		});
	};

	// Roll a die
	const rollDie = () => {
		return Math.floor(Math.random() * 6) + 1;
	};

	// Check if the game is won
	const checkWin = (currentBoard) => {
		for (const combo of winningCombinations) {
			const [a, b, c] = combo;

			// Check for player 1 having all three positions
			if (
				currentBoard[a]?.[1] !== undefined &&
				currentBoard[b]?.[1] !== undefined &&
				currentBoard[c]?.[1] !== undefined
			) {
				// Check if all three positions have dice from both players
				const player2HasDiceInLine =
					currentBoard[a]?.[2] !== undefined ||
					currentBoard[b]?.[2] !== undefined ||
					currentBoard[c]?.[2] !== undefined;

				if (player2HasDiceInLine) {
					// Check if player ones values are higher than player two's
					const player1HasBetterDice =
						currentBoard[a]?.[1] > currentBoard[a]?.[2] &&
						currentBoard[b]?.[1] > currentBoard[b]?.[2] &&
						currentBoard[c]?.[1] > currentBoard[c]?.[2];

					if (player1HasBetterDice) {
						return {
							winner: 1,
							line: combo,
						};
					}
				}
			}

			// Check for player 2 having all three positions
			if (
				currentBoard[a]?.[2] !== undefined &&
				currentBoard[b]?.[2] !== undefined &&
				currentBoard[c]?.[2] !== undefined
			) {
				// Check if all three positions have dice from both players
				const player1HasDiceInLine =
					currentBoard[a]?.[1] !== undefined ||
					currentBoard[b]?.[1] !== undefined ||
					currentBoard[c]?.[1] !== undefined;

				if (player1HasDiceInLine) {
					const player2HasBetterDice =
						currentBoard[a]?.[1] < currentBoard[a]?.[2] &&
						currentBoard[b]?.[1] < currentBoard[b]?.[2] &&
						currentBoard[c]?.[1] < currentBoard[c]?.[2];

					if (player2HasBetterDice) {
						return {
							winner: 2,
							line: combo,
						};
					}
				}
			}
		}

		return null;
	};

	// Check if the game is a draw
	const checkDraw = (currentBoard) => {
		// Check if all cells have dice from both players
		const allFilled = currentBoard.every(
			(cell) =>
				Object.keys(cell).length === 2 &&
				cell[1] !== undefined &&
				cell[2] !== undefined,
		);

		// If all cells are filled and no win condition, it's a draw
		return allFilled;
	};

	// Handle cell click
	const handleCellClick = (index) => {
		// Do nothing if the game is over
		if (gameStatus !== "playing") return;

		// Check if the current player already has a die in this cell
		if (board[index]?.[currentPlayer] !== undefined) return;

		// Ensure a dice type is selected
		if (!selectedDiceType) return;

		// For special dice, ensure a value is selected
		if (selectedDiceType === "special" && !selectedDiceValue) return;

		// Check if player has dice of the selected type
		if (selectedDiceType === "normal" && playerDice[currentPlayer].normal <= 0)
			return;
		if (
			selectedDiceType === "special" &&
			playerDice[currentPlayer].special[selectedDiceValue] <= 0
		)
			return;

		// Create a new board
		const newBoard = [...board];
		if (!newBoard[index]) newBoard[index] = {};

		// Roll the die if normal, otherwise use the selected value
		const diceValue =
			selectedDiceType === "normal" ? rollDie() : selectedDiceValue;

		// Check if the opponent has a die with the same value in this cell
		const otherPlayer = currentPlayer === 1 ? 2 : 1;
		if (
			newBoard[index][otherPlayer] !== undefined &&
			newBoard[index][otherPlayer] === diceValue
		) {
			// Remove both dice
			const updatedCell = { ...newBoard[index] };
			delete updatedCell[otherPlayer];

			// Update player's dice inventory - return the opponent's die
			const updatedDice = { ...playerDice };
			if (newBoard[index][`${otherPlayer}_type`] === "normal") {
				updatedDice[otherPlayer].normal += 1;
			} else {
				updatedDice[otherPlayer].normal += 1;
				// updatedDice[otherPlayer].special[newBoard[index][otherPlayer]] += 1;
			}

			// Don't place the current player's die
			newBoard[index] = updatedCell;
			setBoard(newBoard);
			setPlayerDice(updatedDice);

			// Switch player
			setCurrentPlayer(otherPlayer);
			return;
		}

		// Place the die
		newBoard[index] = {
			...newBoard[index],
			[currentPlayer]: diceValue,
			[`${currentPlayer}_type`]: selectedDiceType,
		};

		// Update player's dice inventory
		const updatedDice = { ...playerDice };
		if (selectedDiceType === "normal") {
			updatedDice[currentPlayer].normal -= 1;
		} else {
			updatedDice[currentPlayer].special[selectedDiceValue] -= 1;
		}
		setPlayerDice(updatedDice);

		// Update the board
		setBoard(newBoard);

		// Check for win
		const winResult = checkWin(newBoard);
		if (winResult) {
			setGameStatus("win");
			setWinner(winResult.winner);
			setWinningLine(winResult.line);
			return;
		}

		// Check for draw
		if (checkDraw(newBoard)) {
			setGameStatus("draw");
			return;
		}

		// Switch player
		setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

		// Reset selected dice
		setSelectedDiceType("normal");
		setSelectedDiceValue(null);
	};

	// Handle dice type selection
	const handleDiceTypeSelect = (type) => {
		setSelectedDiceType(type);
		if (type === "normal") {
			setSelectedDiceValue(null);
		}
	};

	// Handle special dice value selection
	const handleSpecialDiceSelect = (value) => {
		setSelectedDiceValue(value);
	};

	// Render dice in a cell
	const renderCell = (cell, index) => {
		const isWinningCell = winningLine.includes(index);
		const cellBorder = isWinningCell
			? "border-4 border-green-500"
			: "border border-gray-300";

		return (
			<div
				key={index}
				className={`w-20 h-20 bg-gray-100 flex flex-col items-center justify-center cursor-pointer ${cellBorder}`}
				onClick={() => handleCellClick(index)}
			>
				<div className="flex w-full h-full">
					{/* Player 1 Die */}
					<div className="w-1/2 h-full flex items-center justify-center">
						{cell[1] !== undefined && (
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-lg bg-blue-200 ${isWinningCell && winner === 1 ? "ring-2 ring-green-500" : ""}`}
							>
								<span className="text-xl font-bold text-blue-800">
									{cell[1]}
								</span>
							</div>
						)}
					</div>

					{/* Player 2 Die */}
					<div className="w-1/2 h-full flex items-center justify-center">
						{cell[2] !== undefined && (
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-lg bg-red-200 ${isWinningCell && winner === 2 ? "ring-2 ring-green-500" : ""}`}
							>
								<span className="text-xl font-bold text-red-800">
									{cell[2]}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<h1 className="text-3xl font-bold mb-4">Tic Tac Toe with Dice</h1>

			{/* Game status */}
			<div className="mb-4 text-xl">
				{gameStatus === "playing" && (
					<div className="flex items-center">
						<div
							className={`w-4 h-4 rounded-full ${currentPlayer === 1 ? "bg-blue-500" : "bg-red-500"} mr-2`}
						></div>
						<span>Player {currentPlayer}'s turn</span>
					</div>
				)}
				{gameStatus === "win" && (
					<div className="text-green-600">Player {winner} wins!</div>
				)}
				{gameStatus === "draw" && (
					<div className="text-yellow-600">Game ends in a draw!</div>
				)}
			</div>

			{/* Dice selection */}
			{gameStatus === "playing" && (
				<div className="mb-4 p-4 bg-white rounded-lg shadow">
					<div className="mb-2">
						<span className="font-bold">Select Dice Type:</span>
						<div className="flex space-x-4 mt-2">
							<button
								className={`px-4 py-2 rounded ${selectedDiceType === "normal" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
								onClick={() => handleDiceTypeSelect("normal")}
								disabled={playerDice[currentPlayer].normal <= 0}
							>
								Normal ({playerDice[currentPlayer].normal} left)
							</button>
							<button
								className={`px-4 py-2 rounded ${selectedDiceType === "special" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
								onClick={() => handleDiceTypeSelect("special")}
								disabled={Object.values(
									playerDice[currentPlayer].special,
								).every((val) => val <= 0)}
							>
								Special
							</button>
						</div>
					</div>

					{selectedDiceType === "special" && (
						<div className="mt-2">
							<span className="font-bold">Select Special Die:</span>
							<div className="flex space-x-2 mt-2">
								{[4, 5, 6].map((value) => (
									<button
										key={value}
										className={`w-10 h-10 flex items-center justify-center rounded ${selectedDiceValue === value ? "bg-gray-800 text-white" : "bg-gray-200"}`}
										onClick={() => handleSpecialDiceSelect(value)}
										disabled={playerDice[currentPlayer].special[value] <= 0}
									>
										{value} ({playerDice[currentPlayer].special[value]})
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Game board */}
			<div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-lg shadow">
				{board.map((cell, index) => renderCell(cell, index))}
			</div>

			{/* Dice inventory */}
			<div className="mt-6 w-full max-w-md">
				<div className="flex justify-between p-4 bg-white rounded-lg shadow">
					<div className="text-blue-700">
						<h3 className="font-bold">Player 1</h3>
						<p>Normal: {playerDice[1].normal}</p>
						<p>
							Special: 4({playerDice[1].special[4]}) 5(
							{playerDice[1].special[5]}) 6({playerDice[1].special[6]})
						</p>
					</div>
					<div className="text-red-700">
						<h3 className="font-bold">Player 2</h3>
						<p>Normal: {playerDice[2].normal}</p>
						<p>
							Special: 4({playerDice[2].special[4]}) 5(
							{playerDice[2].special[5]}) 6({playerDice[2].special[6]})
						</p>
					</div>
				</div>
			</div>

			{/* Reset button */}
			<button
				className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
				onClick={resetGame}
			>
				New Game
			</button>

			{/* Game rules */}
			<div className="mt-8 p-4 bg-white rounded-lg shadow max-w-md">
				<h2 className="text-xl font-bold mb-2">Game Rules</h2>
				<ul className="list-disc pl-5 space-y-1 text-sm">
					<li>Be the first player to complete a line with your dice</li>
					<li>Both players must have at least one die in the winning line</li>
					<li>
						Each player has 6 normal dice and 3 special dice (values 4, 5, 6)
					</li>
					<li>Each cell can hold one die from each player</li>
					<li>
						If you place a die with the same value as an opponent's die, both
						are removed
					</li>
				</ul>
			</div>
		</div>
	);
};

export default TicTacToeDice;
