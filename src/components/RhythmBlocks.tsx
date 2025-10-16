import { motion } from 'motion/react';
import { GameMode } from './ModeSelection';

interface RhythmBlock {
  id: string;
  lane: number; // 0-7 for the 8 buttons
  timestamp: number;
  color: string;
}

interface RhythmBlocksProps {
  blocks: RhythmBlock[];
  currentTime: number;
  enabled: boolean;
  mode: GameMode;
}

const buttonColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

export function RhythmBlocks({ blocks, currentTime, enabled, mode }: RhythmBlocksProps) {
  if (!enabled || mode === 'freeplay') return null;
  
  // Calculate positions for lanes based on mode
  const lanePositions = mode === 'pneno'
    ? [
        // Pneno mode: only 4 buttons centered
        null, null, null, null, // Left buttons don't exist in Pneno
        'calc(50% - 104px)',
        'calc(50% - 40px)',
        'calc(50% + 24px)',
        'calc(50% + 88px)',
      ]
    : [
        // TapArr/PiCo modes: all 8 buttons
        'calc(50% - 200px)',
        'calc(50% - 136px)',
        'calc(50% - 72px)',
        'calc(50% - 8px)',
        'calc(50% + 8px)',
        'calc(50% + 72px)',
        'calc(50% + 136px)',
        'calc(50% + 200px)',
      ];
  
  const fallDuration = 2; // seconds to fall from top to bottom
  const targetY = 'calc(100vh - 120px)'; // Just above the buttons
  
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {blocks.map(block => {
        const timeUntilHit = block.timestamp - currentTime;
        const progress = 1 - (timeUntilHit / fallDuration);
        
        // Only show blocks that are falling or just hit
        if (progress < -0.1 || progress > 1.1) return null;
        
        // Skip if the lane position is null (Pneno mode with left buttons)
        const leftPosition = lanePositions[block.lane];
        if (leftPosition === null) return null;
        
        return (
          <motion.div
            key={block.id}
            className="absolute w-14 h-14 rounded-lg shadow-lg"
            style={{
              backgroundColor: block.color,
              left: leftPosition,
              opacity: progress > 1 ? 0.3 : 0.7,
            }}
            initial={{ top: '0px' }}
            animate={{ top: targetY }}
            transition={{
              duration: fallDuration,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}
