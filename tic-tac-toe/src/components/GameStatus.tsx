import React from "react";

interface GameStatusProps {
	gameStatus: string;
	currentPlayer: number;
	winner: number | null;
	onNewGame?: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({
	gameStatus,
	currentPlayer,
	winner,
	onNewGame,
}) => {
	if (gameStatus === "playing") {
		return (
			<div className="mb-6 p-4 bg-white rounded-xl shadow-lg border-4 border-dashed border-gray-300">
				<div className="flex items-center justify-center">
					<div
						className={`w-8 h-8 rounded-full ${
							currentPlayer === 1 ? "bg-blue-500" : "bg-red-500"
						} mr-4 animate-pulse shadow-lg`}
					></div>
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-800">
							Player {currentPlayer}'s Turn
						</div>
						<div className="text-sm text-gray-600 mt-1">
							{currentPlayer === 1
								? "Blue player - make your move!"
								: "Red player - make your move!"}
						</div>
					</div>
					<div
						className={`w-8 h-8 rounded-full ${
							currentPlayer === 1 ? "bg-blue-500" : "bg-red-500"
						} ml-4 animate-pulse shadow-lg`}
					></div>
				</div>
			</div>
		);
	}

	if (gameStatus === "win") {
		const winnerName = winner === 1 ? "Blue Player" : "Red Player";
		const backgroundStyle = winner === 1 
			? { background: 'linear-gradient(to right, #2563eb, #1e40af)' } // blue-600 to blue-800
			: { background: 'linear-gradient(to right, #dc2626, #991b1b)' }; // red-600 to red-800
		
		return (
			<div 
				className="mb-6 p-8 rounded-xl shadow-lg text-white"
				style={backgroundStyle}
			>
				<div className="text-center">
					<div className="flex items-center justify-center mb-6">
						<div className="text-5xl mr-4">🎉</div>
						<div>
							<div className="text-3xl font-bold">{winnerName} Wins!</div>
							<div className="text-lg opacity-90 mt-2">
								Congratulations on your victory!
							</div>
						</div>
						<div className="text-5xl ml-4">🏆</div>
					</div>
					{onNewGame && (
						<button
							className="mt-6 px-8 py-4 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-bold shadow-md text-lg"
							onClick={onNewGame}
						>
							Play Again
						</button>
					)}
				</div>
			</div>
		);
	}

	if (gameStatus === "draw") {
		return (
			<div className="mb-6 p-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg text-white">
				<div className="text-center">
					<div className="flex items-center justify-center mb-6">
						<div className="text-5xl mr-4">🤝</div>
						<div>
							<div className="text-3xl font-bold">Game Ends in a Draw!</div>
							<div className="text-lg opacity-90 mt-2">Well played by both sides!</div>
						</div>
						<div className="text-5xl ml-4">⚖️</div>
					</div>
					{onNewGame && (
						<button
							className="mt-6 px-8 py-4 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-bold shadow-md text-lg"
							onClick={onNewGame}
						>
							New Game
						</button>
					)}
				</div>
			</div>
		);
	}

	return null;
};

export default GameStatus;