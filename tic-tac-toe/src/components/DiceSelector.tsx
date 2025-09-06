import React from "react";

interface DiceSelectorProps {
	currentPlayer: number;
	playerDice: any;
	selectedDiceType: string;
	selectedDiceValue: number | null;
	onDiceTypeSelect: (type: string) => void;
	onSpecialDiceSelect: (value: number) => void;
}

const DiceSelector: React.FC<DiceSelectorProps> = ({
	currentPlayer,
	playerDice,
	selectedDiceType,
	selectedDiceValue,
	onDiceTypeSelect,
	onSpecialDiceSelect,
}) => {
	return (
		<div className="mb-4 p-4 bg-white rounded-lg shadow-md border-2 border-gray-200">
			<div className="mb-3">
				<div className="flex items-center mb-2">
					<div
						className={`w-3 h-3 rounded-full ${
							currentPlayer === 1 ? "bg-blue-500" : "bg-red-500"
						} mr-2`}
					></div>
					<span className="font-bold text-lg">
						Player {currentPlayer} - Select Dice:
					</span>
				</div>
				<div className="flex space-x-4 mt-2">
					<button
						className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
							selectedDiceType === "normal"
								? "bg-gray-800 text-white shadow-lg transform scale-105"
								: "bg-gray-200 hover:bg-gray-300"
						}`}
						onClick={() => onDiceTypeSelect("normal")}
						disabled={playerDice[currentPlayer].normal <= 0}
					>
						🎲 Normal ({playerDice[currentPlayer].normal} left)
					</button>
					<button
						className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
							selectedDiceType === "special"
								? "bg-gray-800 text-white shadow-lg transform scale-105"
								: "bg-gray-200 hover:bg-gray-300"
						}`}
						onClick={() => onDiceTypeSelect("special")}
						disabled={Object.values(playerDice[currentPlayer].special).every(
							(val) => val <= 0
						)}
					>
						✨ Special
					</button>
				</div>
			</div>

			{selectedDiceType === "special" && (
				<div className="mt-3 p-3 bg-gray-50 rounded-lg">
					<span className="font-bold text-sm text-gray-700">
						Select Special Die Value:
					</span>
					<div className="flex space-x-2 mt-2">
						{[4, 5, 6].map((value) => (
							<button
								key={value}
								className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg font-bold transition-all duration-200 ${
									selectedDiceValue === value
										? "bg-yellow-400 text-black shadow-lg transform scale-110 ring-2 ring-yellow-600"
										: "bg-gray-200 hover:bg-gray-300"
								}`}
								onClick={() => onSpecialDiceSelect(value)}
								disabled={playerDice[currentPlayer].special[value] <= 0}
							>
								<span className="text-lg">{value}</span>
								<span className="text-xs">
									({playerDice[currentPlayer].special[value]})
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default DiceSelector;