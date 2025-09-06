import React, { useState, useEffect } from "react";
import Dice3D from "./Dice3D";

interface GameCellProps {
	cell: any;
	index: number;
	isWinningCell: boolean;
	winner: number | null;
	onClick: () => void;
	selectedDiceType: string;
	selectedDiceValue: number | null;
	currentPlayer: number;
	canPlace: boolean;
}

const GameCell: React.FC<GameCellProps> = ({
	cell,
	index,
	isWinningCell,
	winner,
	onClick,
	selectedDiceType,
	selectedDiceValue,
	currentPlayer,
	canPlace,
}) => {
	const [isRolling1, setIsRolling1] = useState(false);
	const [isRolling2, setIsRolling2] = useState(false);
	const [rollingValue1, setRollingValue1] = useState<number | null>(null);
	const [rollingValue2, setRollingValue2] = useState<number | null>(null);
	const [isBouncing1, setIsBouncing1] = useState(false);
	const [isBouncing2, setIsBouncing2] = useState(false);
	const [isCrashing1, setIsCrashing1] = useState(false);
	const [isCrashing2, setIsCrashing2] = useState(false);
	const [isHidden1, setIsHidden1] = useState(false);
	const [isHidden2, setIsHidden2] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [prevCell, setPrevCell] = useState(cell);

	const cellBorder = isWinningCell
		? "border-4 border-green-500"
		: "border border-gray-300";

	// Function to generate random dice value for animation
	const getRandomDiceValue = () => Math.floor(Math.random() * 6) + 1;

	// Determine which player is winning in this cell (if both have dice)
	const getCellWinningPlayer = () => {
		if (cell[1] !== undefined && cell[2] !== undefined) {
			if (cell[1] > cell[2]) return 1;
			if (cell[2] > cell[1]) return 2;
		}
		return null;
	};

	const cellWinningPlayer = getCellWinningPlayer();
	
	// Get background color based on who's winning the cell
	const getCellBackgroundColor = () => {
		if (isWinningCell) return "bg-green-200"; // Overall game winning cell
		if (cellWinningPlayer === 1) return "bg-blue-100"; // Player 1 winning this cell
		if (cellWinningPlayer === 2) return "bg-red-100"; // Player 2 winning this cell
		return "bg-gray-100"; // Default or tied
	};

	// Check for newly placed dice and trigger rolling animation for normal dice
	useEffect(() => {
		// Player 1 die was added and it's a normal die
		if (cell[1] !== undefined && prevCell[1] === undefined && cell["1_type"] === "normal") {
			setIsRolling1(true);
			
			// Cycle through random numbers during the animation
			const rollInterval = setInterval(() => {
				setRollingValue1(getRandomDiceValue());
			}, 50); // Change number every 50ms
			
			// Stop rolling after 800ms (matching the animation duration)
			setTimeout(() => {
				clearInterval(rollInterval);
				setRollingValue1(null);
				setIsRolling1(false);
			}, 800);
		}
		
		// Player 2 die was added and it's a normal die
		if (cell[2] !== undefined && prevCell[2] === undefined && cell["2_type"] === "normal") {
			setIsRolling2(true);
			
			// Cycle through random numbers during the animation
			const rollInterval = setInterval(() => {
				setRollingValue2(getRandomDiceValue());
			}, 50); // Change number every 50ms
			
			// Stop rolling after 800ms (matching the animation duration)
			setTimeout(() => {
				clearInterval(rollInterval);
				setRollingValue2(null);
				setIsRolling2(false);
			}, 800);
		}
		
		setPrevCell(cell);
	}, [cell, prevCell]);

	// Check for bouncing/crashing only when both dice are settled (no rolling animations)
	useEffect(() => {
		// Only check for animations if neither die is currently rolling
		if (!isRolling1 && !isRolling2) {
			// Check if there were any changes that warrant animation checking
			const cellChanged = JSON.stringify(cell) !== JSON.stringify(prevCell);
			
			if (cellChanged) {
				// Wait a bit to ensure all animations are done, then check outcomes
				setTimeout(() => {
					// Check for draw/crash situation
					if (cell[1] !== undefined && cell[2] !== undefined && cell[1] === cell[2]) {
						// Same values = crash and disappear
						setIsCrashing1(true);
						setIsCrashing2(true);
						
						// Hide dice after crash animation completes
						setTimeout(() => {
							setIsHidden1(true);
							setIsHidden2(true);
							setIsCrashing1(false);
							setIsCrashing2(false);
						}, 600); // Match crash animation duration
					} else {
						// Reset hidden states if dice values changed
						setIsHidden1(false);
						setIsHidden2(false);
						
						// Player 1 bounces if winning
						if (cell[1] !== undefined && cell[2] !== undefined && cell[1] > cell[2]) {
							setIsBouncing1(true);
							setTimeout(() => setIsBouncing1(false), 600);
						}
						
						// Player 2 bounces if winning  
						if (cell[1] !== undefined && cell[2] !== undefined && cell[2] > cell[1]) {
							setIsBouncing2(true);
							setTimeout(() => setIsBouncing2(false), 600);
						}
					}
				}, 100); // Small delay to ensure everything is settled
			}
		}
	}, [cell, prevCell, isRolling1, isRolling2]);

	const handleClick = () => {
		onClick();
	};

	const getPreviewValue = () => {
		if (selectedDiceType === "normal") {
			return "?";
		}
		return selectedDiceValue;
	};

	const showPreview = isHovered && canPlace && cell[currentPlayer] === undefined;

	return (
		<div
			className={`w-20 h-20 ${getCellBackgroundColor()} flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${cellBorder} ${
				canPlace ? (cellWinningPlayer === 1 ? "hover:bg-blue-200" : cellWinningPlayer === 2 ? "hover:bg-red-200" : "hover:bg-gray-200") : ""
			}`}
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="flex w-full h-full relative">
				{/* Player 1 Die */}
				<div className="w-1/2 h-full flex items-center justify-center">
					{cell[1] !== undefined && !isHidden1 && (
						<div className={`${isWinningCell && winner === 1 ? "ring-2 ring-green-500 rounded-lg" : ""} ${
							isBouncing1 ? "animate-bounce" : ""
						} ${isCrashing1 ? "animate-crash-left" : ""}`}>
							<Dice3D
								value={cell[1]}
								isRolling={isRolling1}
								color="blue"
							/>
						</div>
					)}
					{showPreview && currentPlayer === 1 && (
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 opacity-60 border-2 border-blue-300 border-dashed">
							<span className="text-lg font-bold text-blue-600">
								{getPreviewValue()}
							</span>
						</div>
					)}
				</div>

				{/* Player 2 Die */}
				<div className="w-1/2 h-full flex items-center justify-center">
					{cell[2] !== undefined && !isHidden2 && (
						<div className={`${isWinningCell && winner === 2 ? "ring-2 ring-green-500 rounded-lg" : ""} ${
							isBouncing2 ? "animate-bounce" : ""
						} ${isCrashing2 ? "animate-crash-right" : ""}`}>
							<Dice3D
								value={cell[2]}
								isRolling={isRolling2}
								color="red"
							/>
						</div>
					)}
					{showPreview && currentPlayer === 2 && (
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 opacity-60 border-2 border-red-300 border-dashed">
							<span className="text-lg font-bold text-red-600">
								{getPreviewValue()}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default GameCell;