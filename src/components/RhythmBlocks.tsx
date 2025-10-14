import { motion } from 'motion/react';

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
}

const buttonColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

export function RhythmBlocks({ blocks, currentTime, enabled }: RhythmBlocksProps) {
  if (!enabled) return null;
  
  // Calculate positions for lanes
  const lanePositions = [
    // Left 4 buttons (centered in left group)
    'calc(50% - 200px)',
    'calc(50% - 136px)',
    'calc(50% - 72px)',
    'calc(50% - 8px)',
    // Right 4 buttons (centered in right group)
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
        
        return (
          <motion.div
            key={block.id}
            className="absolute w-14 h-14 rounded-lg shadow-lg"
            style={{
              backgroundColor: block.color,
              left: lanePositions[block.lane],
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
