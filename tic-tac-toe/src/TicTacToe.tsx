import React, { useState } from "react";
import GameStatus from "./components/GameStatus";
import GameBoard from "./components/GameBoard";

const TicTacToeDice = () => {
	// Game state
	const [board, setBoard] = useState(Array(9).fill({}));
	const [currentPlayer, setCurrentPlayer] = useState(1); // Player 1 or 2
	const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'win', 'draw'
	const [winner, setWinner] = useState(null);
	const [winningLine, setWinningLine] = useState([]);

	// Player used special dice (simplified inventory)
	const [usedSpecialDice, setUsedSpecialDice] = useState({
		1: { 4: false, 5: false, 6: false },
		2: { 4: false, 5: false, 6: false },
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
		setUsedSpecialDice({
			1: { 4: false, 5: false, 6: false },
			2: { 4: false, 5: false, 6: false },
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

		// Check if special die is already used
		if (
			selectedDiceType === "special" &&
			usedSpecialDice[currentPlayer][selectedDiceValue]
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
			// Place the die first to trigger crash animation
			newBoard[index] = {
				...newBoard[index],
				[currentPlayer]: diceValue,
				[`${currentPlayer}_type`]: selectedDiceType,
			};

			// Mark current player's special die as used if it was special
			let updatedUsedDice = { ...usedSpecialDice };
			if (selectedDiceType === "special") {
				updatedUsedDice[currentPlayer][selectedDiceValue] = true;
			}

			setBoard(newBoard);
			setUsedSpecialDice(updatedUsedDice);

			// Remove both dice after crash animation completes (700ms delay)
			setTimeout(() => {
				setBoard(prevBoard => {
					const crashBoard = [...prevBoard];
					const updatedCell = { ...crashBoard[index] };
					delete updatedCell[otherPlayer];
					delete updatedCell[currentPlayer];
					delete updatedCell[`${otherPlayer}_type`];
					delete updatedCell[`${currentPlayer}_type`];
					crashBoard[index] = updatedCell;
					return crashBoard;
				});
			}, 700);

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

		// Mark special die as used if it was special
		let updatedUsedDice = { ...usedSpecialDice };
		if (selectedDiceType === "special") {
			updatedUsedDice[currentPlayer][selectedDiceValue] = true;
			setUsedSpecialDice(updatedUsedDice);
		}

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

	// Handle direct dice selection
	const handleDiceSelect = (type, value = null) => {
		// Only allow current player to select their dice
		setSelectedDiceType(type);
		setSelectedDiceValue(value);
	};

	// Render dice for a player
	const renderDiceRow = (player) => {
		const isCurrentPlayer = player === currentPlayer;
		const bgColor = player === 1 ? 'bg-blue-200' : 'bg-red-200';
		const textColor = player === 1 ? 'text-blue-800' : 'text-red-800';
		const hoverBgColor = player === 1 ? 'hover:bg-blue-300' : 'hover:bg-red-300';
		const disabledBgColor = 'bg-gray-200';
		const disabledTextColor = 'text-gray-400';

		return (
			<div className="flex justify-center space-x-4 mb-4">
				{/* Random die */}
				<div className="relative">
					<div
						className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 cursor-pointer ${
							isCurrentPlayer && gameStatus === 'playing'
								? selectedDiceType === 'normal'
									? `${bgColor} shadow-lg transform scale-110 ring-2 ring-white`
									: `${bgColor} ${hoverBgColor} hover:transform hover:scale-105`
								: `${disabledBgColor} cursor-not-allowed`
						}`}
						onClick={() => isCurrentPlayer && gameStatus === 'playing' && handleDiceSelect('normal')}
					>
						<span className={`text-xl font-bold ${
							isCurrentPlayer && gameStatus === 'playing' ? textColor : disabledTextColor
						}`}>
							?
						</span>
					</div>
				</div>

				{/* Special dice */}
				{[4, 5, 6].map((value) => {
					const isUsed = usedSpecialDice[player][value];
					const isSelected = isCurrentPlayer && selectedDiceType === 'special' && selectedDiceValue === value;
					
					return (
						<div key={value} className="relative">
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 cursor-pointer ${
									isUsed
										? `${disabledBgColor} cursor-not-allowed opacity-50`
										: isCurrentPlayer && gameStatus === 'playing'
											? isSelected
												? `${bgColor} shadow-lg transform scale-110 ring-2 ring-white`
												: `${bgColor} ${hoverBgColor} hover:transform hover:scale-105`
											: `${disabledBgColor} cursor-not-allowed`
								}`}
								onClick={() => isCurrentPlayer && !isUsed && gameStatus === 'playing' && handleDiceSelect('special', value)}
							>
								<span className={`text-xl font-bold ${
									isUsed ? disabledTextColor : isCurrentPlayer && gameStatus === 'playing' ? textColor : disabledTextColor
								}`}>
									{isUsed ? '✗' : value}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		);
	};


	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
			<h1 className="text-4xl font-bold mb-6 text-gray-800 drop-shadow-lg">
				🎲 Tic Tac Toe with Dice 🎲
			</h1>

			{/* Game status */}
			<GameStatus
				gameStatus={gameStatus}
				currentPlayer={currentPlayer}
				winner={winner}
				onNewGame={resetGame}
			/>

			{/* Blue player dice (Player 1) - Above board */}
			{gameStatus === "playing" && (
				<div className="mb-6">
					<div className="text-center mb-2">
						<span className="text-blue-600 font-bold text-lg">Blue Player</span>
					</div>
					{renderDiceRow(1)}
				</div>
			)}

			{/* Game board */}
			<GameBoard
				board={board}
				winningLine={winningLine}
				winner={winner}
				onCellClick={handleCellClick}
				selectedDiceType={selectedDiceType}
				selectedDiceValue={selectedDiceValue}
				currentPlayer={currentPlayer}
			/>

			{/* Red player dice (Player 2) - Below board */}
			{gameStatus === "playing" && (
				<div className="mt-6">
					<div className="text-center mb-2">
						<span className="text-red-600 font-bold text-lg">Red Player</span>
					</div>
					{renderDiceRow(2)}
				</div>
			)}


			{/* Game rules */}
			<div className="mt-8 p-4 bg-white rounded-lg shadow max-w-md">
				<h2 className="text-xl font-bold mb-2">Game Rules</h2>
				<ul className="list-disc pl-5 space-y-1 text-sm">
					<li>Be the first player to complete a line with your dice</li>
					<li>Both players must have at least one die in the winning line</li>
					<li>
						Click on your dice to select: 🎲 for random (1-6), or fixed values (4, 5, 6)
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
