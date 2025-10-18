import { useEffect } from "react";
import { GameMode } from "./ModeSelection";

interface GameButtonsProps {
  onButtonPress: (index: number) => void;
  onButtonRelease: (index: number) => void;
  activeButtons: Set<number>;
  mode: GameMode;
}

const buttonKeys = ["a", "s", "d", "f", "h", "j", "k", "l"];
const buttonColors = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#10b981", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

export function GameButtons({
  onButtonPress,
  onButtonRelease,
  activeButtons,
  mode,
}: GameButtonsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const index = buttonKeys.indexOf(e.key.toLowerCase());

      // For Pneno mode, only allow hjkl keys (indices 4-7)
      if (mode === "pneno" && index < 4) {
        return;
      }

      if (index !== -1 && !activeButtons.has(index)) {
        onButtonPress(index);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const index = buttonKeys.indexOf(e.key.toLowerCase());

      // For Pneno mode, only allow hjkl keys
      if (mode === "pneno" && index < 4) {
        return;
      }

      if (index !== -1) {
        onButtonRelease(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeButtons, onButtonPress, onButtonRelease, mode]);

  // Pneno mode: only show 4 buttons (right side, centered)
  if (mode === "pneno") {
    return (
      <div className="flex gap-2 justify-center pb-4">
        {[4, 5, 6, 7].map((i) => (
          <button
            key={i}
            className="w-16 h-16 rounded-lg transition-all duration-100 shadow-lg relative"
            style={{
              backgroundColor: buttonColors[i],
              transform: activeButtons.has(i) ? "scale(0.95)" : "scale(1)",
              opacity: activeButtons.has(i) ? 1 : 0.85,
            }}
            onMouseDown={() => onButtonPress(i)}
            onMouseUp={() => onButtonRelease(i)}
            onMouseLeave={() => activeButtons.has(i) && onButtonRelease(i)}
            onTouchStart={() => onButtonPress(i)}
            onTouchEnd={() => onButtonRelease(i)}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-60">
              {buttonKeys[i].toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // TapArr and PiCo modes: show all 8 buttons
  // Use larger gap for TapArr mode to clearly separate left/right hands
  const groupGap = mode === "tapArr" ? "gap-16" : "gap-4";

  return (
    <div className={`flex ${groupGap} justify-center items-end pb-4`}>
      {/* Left 4 buttons */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            className="w-16 h-16 rounded-lg transition-all duration-100 shadow-lg relative"
            style={{
              backgroundColor: buttonColors[i],
              transform: activeButtons.has(i) ? "scale(0.95)" : "scale(1)",
              opacity: activeButtons.has(i) ? 1 : 0.85,
            }}
            onMouseDown={() => onButtonPress(i)}
            onMouseUp={() => onButtonRelease(i)}
            onMouseLeave={() => activeButtons.has(i) && onButtonRelease(i)}
            onTouchStart={() => onButtonPress(i)}
            onTouchEnd={() => onButtonRelease(i)}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-60">
              {buttonKeys[i].toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* Right 4 buttons */}
      <div className="flex gap-2">
        {[4, 5, 6, 7].map((i) => (
          <button
            key={i}
            className="w-16 h-16 rounded-lg transition-all duration-100 shadow-lg relative"
            style={{
              backgroundColor: buttonColors[i],
              transform: activeButtons.has(i) ? "scale(0.95)" : "scale(1)",
              opacity: activeButtons.has(i) ? 1 : 0.85,
            }}
            onMouseDown={() => onButtonPress(i)}
            onMouseUp={() => onButtonRelease(i)}
            onMouseLeave={() => activeButtons.has(i) && onButtonRelease(i)}
            onTouchStart={() => onButtonPress(i)}
            onTouchEnd={() => onButtonRelease(i)}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-60">
              {buttonKeys[i].toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
