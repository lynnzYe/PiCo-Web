import { motion, AnimatePresence } from "motion/react";
import { GameMode } from "./ModeSelection";

interface RhythmBlock {
  id: string;
  lane: number;
  spawnTime: number; // Scheduled time when block should appear
  color: string;
  state: "active" | "pressed";
}

interface RhythmBlocksProps {
  blocks: RhythmBlock[];
  currentTime: number;
  enabled: boolean;
  mode: GameMode;
  sequenceStartTime: number | null;
  streamPaused: boolean;
  pausedAtTime: number | null;
}

export function RhythmBlocks({
  blocks,
  currentTime,
  enabled,
  mode,
  sequenceStartTime,
  streamPaused,
  pausedAtTime,
}: RhythmBlocksProps) {
  if (!enabled || mode === "freeplay" || sequenceStartTime === null)
    return null;

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
  const fallDuration = 2.0; // seconds to fall from top to target

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      <AnimatePresence>
        {blocks.map((block) => {
          // Use pausedAtTime if stream is paused, otherwise use currentTime
          const effectiveTime =
            streamPaused && pausedAtTime !== null ? pausedAtTime : currentTime;

          // Calculate how long this block has been active (time since it should have spawned)
          const blockAge = effectiveTime - sequenceStartTime - block.spawnTime;

          // Don't render blocks that haven't spawned yet
          if (blockAge < 0) return null;

          // Skip if the lane position is null (Pneno mode with left buttons)
          const leftPosition = getLanePosition(block.lane);
          if (leftPosition === null) return null;

          // Calculate position based on time
          // Position ranges from 0 (top) to targetY + overshootDistance (stopped at button)
          const progress = Math.min(blockAge / fallDuration, 1);
          const currentTop = progress * (targetY + overshootDistance);

          // Handle pressed state - animate down and fade out from current position
          if (block.state === "pressed") {
            return (
              <motion.div
                key={block.id}
                className="absolute rounded-lg shadow-lg"
                style={{
                  backgroundColor: block.color,
                  left: leftPosition,
                  width: `${buttonWidth}px`,
                  height: `${buttonWidth}px`,
                  top: `${currentTop}px`,
                }}
                initial={{
                  opacity: 0.7,
                }}
                animate={{
                  top: `${window.innerHeight + 100}px`,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeIn",
                }}
              />
            );
          }

          // Active block - normal position
          return (
            <motion.div
              key={block.id}
              className="absolute rounded-lg shadow-lg"
              style={{
                backgroundColor: block.color,
                left: leftPosition,
                width: `${buttonWidth}px`,
                height: `${buttonWidth}px`,
                top: `${currentTop}px`,
                opacity: 0.7,
              }}
              initial={false}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
