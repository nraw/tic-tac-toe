import React, { useState } from "react";

// Type definitions
type Player = 1 | 2;
type GameStatus = "playing" | "win" | "draw";
type DiceType = "normal" | "special";
type SpecialDiceValue = 4 | 5 | 6;

interface DieInfo {
	player: Player;
	value: number;
}

interface PlayerDiceInventory {
	normal: number;
	special: {
		4: number;
		5: number;
		6: number;
	};
}

type BoardState = (DieInfo | null)[];

const TicTacToeDice: React.FC = () => {
	// Game state
	const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
	const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
	const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
	const [winner, setWinner] = useState<Player | null>(null);
	const [winningLine, setWinningLine] = useState<number[]>([]);

	// Player dice inventory
	const [playerDice, setPlayerDice] = useState<
		Record<Player, PlayerDiceInventory>
	>({
		1: { normal: 6, special: { 4: 1, 5: 1, 6: 1 } },
		2: { normal: 6, special: { 4: 1, 5: 1, 6: 1 } },
	});

	// Selected dice type and value
	const [selectedDiceType, setSelectedDiceType] = useState<DiceType>("normal");
	const [selectedDiceValue, setSelectedDiceValue] =
		useState<SpecialDiceValue | null>(null);

	// Winning combinations
	const winningCombinations: number[][] = [
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
		setBoard(Array(9).fill(null));
		setCurrentPlayer(1);
		setGameStatus("playing");
		setWinner(null);
		setWinningLine([]);
		setSelectedDiceType("normal");
		setSelectedDiceValue(null);
		setPlayerDice({
			1: { normal: 6, special: { 4: 1, 5: 1, 6: 1 } },
			2: { normal: 6, special: { 4: 1, 5: 1, 6: 1 } },
		});
	};

	// Roll a die
	const rollDie = (): number => {
		return Math.floor(Math.random() * 6) + 1;
	};

	// Check if the game is won
	const checkWin = (currentBoard: BoardState) => {
		for (const combo of winningCombinations) {
			const [a, b, c] = combo;

			// Skip if any position is empty
			if (!currentBoard[a] || !currentBoard[b] || !currentBoard[c]) continue;

			// Check if all three positions have dice from both players
			const posA = currentBoard[a]!;
			const posB = currentBoard[b]!;
			const posC = currentBoard[c]!;

			const player1HasDice =
				posA.player === 1 || posB.player === 1 || posC.player === 1;
			const player2HasDice =
				posA.player === 2 || posB.player === 2 || posC.player === 2;

			// Both players must have at least one die in the line
			if (!player1HasDice || !player2HasDice) continue;

			// Check if one player has all three positions
			if (posA.player === posB.player && posB.player === posC.player) {
				return {
					winner: posA.player,
					line: combo,
				};
			}
		}

		return null;
	};

	// Check if the game is a draw
	const checkDraw = (currentBoard: BoardState): boolean => {
		return currentBoard.every((cell) => cell !== null);
	};

	// Handle cell click
	const handleCellClick = (index: number): void => {
		// Do nothing if the game is over or cell is occupied
		if (gameStatus !== "playing" || board[index] !== null) return;

		// Ensure a dice type is selected
		if (!selectedDiceType) return;

		// For special dice, ensure a value is selected
		if (selectedDiceType === "special" && !selectedDiceValue) return;

		// Check if player has dice of the selected type
		if (selectedDiceType === "normal" && playerDice[currentPlayer].normal <= 0)
			return;
		if (
			selectedDiceType === "special" &&
			selectedDiceValue &&
			playerDice[currentPlayer].special[selectedDiceValue] <= 0
		)
			return;

		// Create a new board
		const newBoard = [...board];

		// Roll the die if normal, otherwise use the selected value
		const diceValue =
			selectedDiceType === "normal" ? rollDie() : (selectedDiceValue as number);

		// Check if the cell already has an opponent's die with the same value
		if (
			newBoard[index] &&
			newBoard[index]!.player !== currentPlayer &&
			newBoard[index]!.value === diceValue
		) {
			// Remove both dice
			newBoard[index] = null;

			// Update player's dice inventory - return the die to the player
			const updatedDice = { ...playerDice };
			if (selectedDiceType === "normal") {
				updatedDice[currentPlayer].normal += 1;
			} else if (selectedDiceValue) {
				updatedDice[currentPlayer].special[selectedDiceValue] += 1;
			}
			setPlayerDice(updatedDice);

			// Switch player
			setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
			return;
		}

		// Place the die
		newBoard[index] = {
			player: currentPlayer,
			value: diceValue,
		};

		// Update player's dice inventory
		const updatedDice = { ...playerDice };
		if (selectedDiceType === "normal") {
			updatedDice[currentPlayer].normal -= 1;
		} else if (selectedDiceValue) {
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
	const handleDiceTypeSelect = (type: DiceType): void => {
		setSelectedDiceType(type);
		if (type === "normal") {
			setSelectedDiceValue(null);
		}
	};

	// Handle special dice value selection
	const handleSpecialDiceSelect = (value: SpecialDiceValue): void => {
		setSelectedDiceValue(value);
	};

	// Render a die
	const renderDie = (value: DieInfo | null) => {
		if (!value) return null;

		// Die styling based on player
		const dieColor = value.player === 1 ? "bg-blue-200" : "bg-red-200";
		const textColor = value.player === 1 ? "text-blue-800" : "text-red-800";

		// Check if this cell is part of the winning line
		const cellIndex = board.findIndex((cell) => cell === value);
		const isWinningCell = winningLine.includes(cellIndex);
		const winningStyle = isWinningCell ? "border-4 border-green-500" : "";

		return (
			<div
				className={`flex items-center justify-center w-12 h-12 rounded-lg ${dieColor} ${winningStyle}`}
			>
				<span className={`text-2xl font-bold ${textColor}`}>{value.value}</span>
			</div>
		);
	};

	// Render function
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
								{([4, 5, 6] as const).map((value) => (
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
				{board.map((cell, index) => (
					<div
						key={index}
						className="w-16 h-16 bg-gray-100 flex items-center justify-center cursor-pointer border border-gray-300"
						onClick={() => handleCellClick(index)}
					>
						{renderDie(cell)}
					</div>
				))}
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
