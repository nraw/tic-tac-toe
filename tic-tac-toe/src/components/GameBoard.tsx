import React from "react";
import GameCell from "./GameCell";

interface GameBoardProps {
	board: Array<any>;
	winningLine: number[];
	winner: number | null;
	onCellClick: (index: number) => void;
	selectedDiceType: string;
	selectedDiceValue: number | null;
	currentPlayer: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
	board,
	winningLine,
	winner,
	onCellClick,
	selectedDiceType,
	selectedDiceValue,
	currentPlayer,
}) => {
	// Get gradient class based on current player
	const getGradientClass = () => {
		if (currentPlayer === 1) {
			return "bg-gradient-to-r from-blue-100 via-blue-25 to-white";
		} else {
			return "bg-gradient-to-l from-red-100 via-red-25 to-white";
		}
	};

	return (
		<div className={`grid grid-cols-3 gap-2 p-4 rounded-lg shadow ${getGradientClass()}`}>
			{board.map((cell, index) => (
				<GameCell
					key={index}
					cell={cell}
					index={index}
					isWinningCell={winningLine.includes(index)}
					winner={winner}
					onClick={() => onCellClick(index)}
					selectedDiceType={selectedDiceType}
					selectedDiceValue={selectedDiceValue}
					currentPlayer={currentPlayer}
					canPlace={
						cell[currentPlayer] === undefined &&
						selectedDiceType &&
						(selectedDiceType === "normal" || selectedDiceValue !== null)
					}
				/>
			))}
		</div>
	);
};

export default GameBoard;