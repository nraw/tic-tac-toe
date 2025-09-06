import React from "react";

interface Dice3DProps {
	value: number;
	isRolling: boolean;
	color: "blue" | "red";
}

const Dice3D: React.FC<Dice3DProps> = ({ value, isRolling, color }) => {
	// Function to generate dice dots pattern based on value
	const getDicePattern = (num: number) => {
		const patterns: { [key: number]: boolean[] } = {
			1: [false, false, false, false, true, false, false, false, false],
			2: [true, false, false, false, false, false, false, false, true],
			3: [true, false, false, false, true, false, false, false, true],
			4: [true, false, true, false, false, false, true, false, true],
			5: [true, false, true, false, true, false, true, false, true],
			6: [true, false, true, true, false, true, true, false, true],
		};
		return patterns[num] || patterns[1];
	};

	const renderDiceFace = (faceValue: number, className: string) => {
		const pattern = getDicePattern(faceValue);
		return (
			<div className={`dice-face ${className}`}>
				<div className="dice-dots">
					{pattern.map((hasDot, index) => (
						<div key={index} className="dice-dot" style={{ opacity: hasDot ? 1 : 0 }} />
					))}
				</div>
			</div>
		);
	};

	const bgColor = color === "blue" ? "bg-blue-200" : "bg-red-200";
	const textColor = color === "blue" ? "text-blue-800" : "text-red-800";

	if (isRolling) {
		// Show 3D cube while rolling
		return (
			<div className={`dice-3d animate-dice-roll`}>
				{renderDiceFace(1, "front")}
				{renderDiceFace(2, "back")}
				{renderDiceFace(3, "right")}
				{renderDiceFace(4, "left")}
				{renderDiceFace(5, "top")}
				{renderDiceFace(6, "bottom")}
			</div>
		);
	}

	// Show 2D result after rolling
	return (
		<div className={`flex items-center justify-center w-8 h-8 rounded-lg ${bgColor} transition-all duration-300`}>
			<span className={`text-xl font-bold ${textColor}`}>
				{value}
			</span>
		</div>
	);
};

export default Dice3D;