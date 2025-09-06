import React from "react";

interface PlayerInventoryProps {
	playerDice: any;
}

const PlayerInventory: React.FC<PlayerInventoryProps> = ({ playerDice }) => {
	return (
		<div className="mt-6 w-full max-w-md">
			<div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
				<h3 className="text-lg font-bold text-center mb-3 text-gray-700">
					Dice Inventory
				</h3>
				<div className="flex justify-between space-x-4">
					<div className="flex-1 text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
						<div className="flex items-center justify-center mb-2">
							<div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
							<h4 className="font-bold text-blue-700">Player 1</h4>
						</div>
						<div className="space-y-1 text-sm">
							<p className="font-medium">
								🎲 Normal: <span className="font-bold">{playerDice[1].normal}</span>
							</p>
							<div className="flex justify-center space-x-2">
								<span className="bg-blue-200 px-2 py-1 rounded text-xs">
									4({playerDice[1].special[4]})
								</span>
								<span className="bg-blue-200 px-2 py-1 rounded text-xs">
									5({playerDice[1].special[5]})
								</span>
								<span className="bg-blue-200 px-2 py-1 rounded text-xs">
									6({playerDice[1].special[6]})
								</span>
							</div>
						</div>
					</div>
					
					<div className="flex-1 text-center p-3 bg-red-50 rounded-lg border border-red-200">
						<div className="flex items-center justify-center mb-2">
							<div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
							<h4 className="font-bold text-red-700">Player 2</h4>
						</div>
						<div className="space-y-1 text-sm">
							<p className="font-medium">
								🎲 Normal: <span className="font-bold">{playerDice[2].normal}</span>
							</p>
							<div className="flex justify-center space-x-2">
								<span className="bg-red-200 px-2 py-1 rounded text-xs">
									4({playerDice[2].special[4]})
								</span>
								<span className="bg-red-200 px-2 py-1 rounded text-xs">
									5({playerDice[2].special[5]})
								</span>
								<span className="bg-red-200 px-2 py-1 rounded text-xs">
									6({playerDice[2].special[6]})
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlayerInventory;