import { motion, AnimatePresence } from "motion/react";
import { GameMode } from "./ModeSelection";

interface RhythmBlock {
  id: string;
  lane: number; // 0-7 for the 8 buttons
  sequenceIndex: number;
  color: string;
  state: "waiting" | "falling" | "stopped" | "pressed";
  fallStartTime?: number;
}

interface RhythmBlocksProps {
  blocks: RhythmBlock[];
  currentTime: number;
  enabled: boolean;
  mode: GameMode;
}

export function RhythmBlocks({
  blocks,
  currentTime,
  enabled,
  mode,
}: RhythmBlocksProps) {
  if (!enabled || mode === "freeplay") return null;

  // Button dimensions
  const buttonWidth = 64; // 16 * 4 (w-16)
  const buttonGap = 8; // gap-2
  const groupGap = mode === "tapArr" ? 64 : 16; // gap-16 for TapArr, gap-4 for others

  // Calculate positions for lanes based on mode
  const getLanePosition = (lane: number): string | null => {
    if (mode === "pneno") {
      // Pneno mode: only 4 buttons centered (lanes 4-7)
      if (lane < 4) return null;

      const laneInGroup = lane - 4; // 0-3
      const groupWidth = 4 * buttonWidth + 3 * buttonGap;
      const offset = laneInGroup * (buttonWidth + buttonGap);
      return `calc(50% - ${groupWidth / 2}px + ${offset}px)`;
    } else {
      // TapArr/PiCo modes: all 8 buttons in two groups
      const isRightGroup = lane >= 4;
      const laneInGroup = isRightGroup ? lane - 4 : lane; // 0-3

      const leftGroupWidth = 4 * buttonWidth + 3 * buttonGap;
      const rightGroupWidth = 4 * buttonWidth + 3 * buttonGap;
      const totalWidth = leftGroupWidth + groupGap + rightGroupWidth;

      if (isRightGroup) {
        // Right group
        const offset = laneInGroup * (buttonWidth + buttonGap);
        return `calc(50% - ${totalWidth / 2}px + ${
          leftGroupWidth + groupGap
        }px + ${offset}px)`;
      } else {
        // Left group
        const offset = laneInGroup * (buttonWidth + buttonGap);
        return `calc(50% - ${totalWidth / 2}px + ${offset}px)`;
      }
    }
  };

  // Calculate the target Y position (where the buttons are)
  const buttonAreaHeight = 64 + 16 + 24; // button height + pb-4 + py-6
  const targetY = window.innerHeight - buttonAreaHeight;
  const overshootDistance = 20; // pixels beyond the button before stopping
  const fallDuration = 2; // seconds to fall from top to target
  const FALL_DURATION = 2.0; // seconds
  const SCREEN_HEIGHT = window.innerHeight;
  const TARGET_Y = SCREEN_HEIGHT - buttonAreaHeight;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      <AnimatePresence>
        {blocks.map((block) => {
          // Only render blocks that are falling, stopped, or pressed (not waiting)
          if (block.state === "waiting") return null;

          // Skip if the lane position is null (Pneno mode with left buttons)
          const leftPosition = getLanePosition(block.lane);
          if (leftPosition === null) return null;

          // Determine animation based on block state
          let animationProps: any = {};

          if (block.state === "pressed") {
            // Block was pressed - continue falling and fade out
            animationProps = {
              animate: {
                top: `${window.innerHeight + 100}px`,
                opacity: 0,
              },
              exit: { opacity: 0 },
              transition: {
                duration: 0.5,
                ease: "easeIn",
              },
            };
          } else if (block.state === "stopped") {
            // Block is stopped at the button, waiting for press
            animationProps = {
              animate: {
                top: `${targetY + overshootDistance}px`,
                opacity: 0.7,
              },
            };
          } else if (block.state === "falling") {
            // Block is falling - animate to the stopped position
            animationProps = {
              initial: { top: "0px", opacity: 0.7 },
              animate: {
                top: `${targetY + overshootDistance}px`,
                opacity: 0.7,
              },
              transition: {
                duration: fallDuration,
                ease: "linear",
              },
            };
          }

          return (
            <motion.div
              key={block.id}
              className="absolute rounded-lg shadow-lg"
              style={{
                backgroundColor: block.color,
                left: leftPosition,
                width: `${buttonWidth}px`,
                height: `${buttonWidth}px`,
              }}
              {...animationProps}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
