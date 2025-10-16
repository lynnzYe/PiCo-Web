import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Settings as SettingsIcon, Trash2, Grid3x3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PianoVisualization } from './PianoVisualization';
import { GameButtons } from './GameButtons';
import { RhythmBlocks } from './RhythmBlocks';
import { Settings } from './Settings';
import { GameMode } from './ModeSelection';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface MidiEvent {
  id: string;
  pitch: number;
  velocity: number;
  startTime: number;
  endTime: number | null;
  color: string;
}

interface RhythmBlock {
  id: string;
  lane: number;
  timestamp: number;
  color: string;
}

interface PianoPlayerProps {
  songTitle: string;
  mode: GameMode;
  availableModes: GameMode[];
  onBack: () => void;
  onModeChange: (mode: GameMode) => void;
}

const modeNames: Record<GameMode, string> = {
  pneno: 'Pneno',
  tapArr: 'TapArr',
  piCo: 'PiCo',
  freeplay: 'Freeplay',
};

const buttonColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

// Map button index to MIDI pitch (around middle C for demo)
const buttonToMidi = [60, 62, 64, 65, 67, 69, 71, 72]; // C, D, E, F, G, A, B, C

export function PianoPlayer({ songTitle, mode, availableModes, onBack, onModeChange }: PianoPlayerProps) {
  const [midiEvents, setMidiEvents] = useState<MidiEvent[]>([]);
  const [activeButtons, setActiveButtons] = useState<Set<number>>(new Set());
  const [currentTime, setCurrentTime] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rhythmHintsEnabled, setRhythmHintsEnabled] = useState(false);
  const [rhythmBlocks, setRhythmBlocks] = useState<RhythmBlock[]>([]);
  
  // Update current time for animation
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setCurrentTime((Date.now() - startTime) / 1000);
    }, 1000 / 60); // 60 FPS
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate demo rhythm blocks if enabled
  useEffect(() => {
    if (rhythmHintsEnabled && rhythmBlocks.length === 0 && mode !== 'freeplay') {
      // Generate some demo rhythm blocks
      const blocks: RhythmBlock[] = [];
      const startTime = currentTime + 1;
      
      // For Pneno mode, only use lanes 4-7 (right 4 buttons)
      const minLane = mode === 'pneno' ? 4 : 0;
      const maxLane = 8;
      const laneCount = maxLane - minLane;
      
      for (let i = 0; i < 20; i++) {
        const lane = minLane + Math.floor(Math.random() * laneCount);
        blocks.push({
          id: `block-${i}`,
          lane,
          timestamp: startTime + i * 0.5,
          color: buttonColors[lane],
        });
      }
      
      setRhythmBlocks(blocks);
    }
  }, [rhythmHintsEnabled, currentTime, mode]);
  
  const handleButtonPress = useCallback((buttonIndex: number) => {
    setActiveButtons(prev => new Set(prev).add(buttonIndex));
    
    // Create MIDI note on event
    const pitch = buttonToMidi[buttonIndex];
    const newEvent: MidiEvent = {
      id: `${Date.now()}-${buttonIndex}`,
      pitch: pitch - 21, // Convert to 0-87 range (A0 = 21 in MIDI)
      velocity: 100,
      startTime: currentTime,
      endTime: null,
      color: buttonColors[buttonIndex],
    };
    
    setMidiEvents(prev => [...prev, newEvent]);
    
    // Send to algorithm based on mode
    // TapArr and PiCo modes would send button press events to their respective algorithms
    if (mode === 'tapArr') {
      // TapArr algorithm would receive: { type: 'noteOn', button: buttonIndex, velocity: 100, timestamp: currentTime }
      console.log('TapArr algorithm: noteOn', { button: buttonIndex, velocity: 100 });
    } else if (mode === 'piCo') {
      // PiCo algorithm would receive: { type: 'noteOn', button: buttonIndex, velocity: 100, timestamp: currentTime }
      console.log('PiCo algorithm: noteOn', { button: buttonIndex, velocity: 100 });
    }
  }, [currentTime, mode]);
  
  const handleButtonRelease = useCallback((buttonIndex: number) => {
    setActiveButtons(prev => {
      const next = new Set(prev);
      next.delete(buttonIndex);
      return next;
    });
    
    // Update the most recent event for this button to add end time
    setMidiEvents(prev => {
      const events = [...prev];
      // Find the most recent event for this pitch that doesn't have an end time
      const pitch = buttonToMidi[buttonIndex] - 21;
      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].pitch === pitch && events[i].endTime === null) {
          events[i] = { ...events[i], endTime: currentTime };
          break;
        }
      }
      return events;
    });
    
    // Send to algorithm based on mode
    if (mode === 'tapArr') {
      console.log('TapArr algorithm: noteOff', { button: buttonIndex });
    } else if (mode === 'piCo') {
      console.log('PiCo algorithm: noteOff', { button: buttonIndex });
    }
  }, [currentTime, mode]);
  
  const handleClearHistory = () => {
    setMidiEvents([]);
  };
  
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <h2>{songTitle}</h2>
          {mode !== 'freeplay' && (
            <>
              {availableModes.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Grid3x3 className="w-4 h-4" />
                      {modeNames[mode]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    {availableModes.map((availableMode) => (
                      <DropdownMenuItem
                        key={availableMode}
                        onClick={() => onModeChange(availableMode)}
                        disabled={availableMode === mode}
                      >
                        {modeNames[availableMode]}
                        {availableMode === mode && ' (Current)'}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Badge variant="secondary">{modeNames[mode]}</Badge>
              )}
            </>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearHistory}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
          >
            <SettingsIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Piano visualization area */}
      <div className="flex-1 relative bg-gradient-to-b from-background to-muted/20">
        <PianoVisualization
          midiEvents={midiEvents}
          currentTime={currentTime}
        />
        
        {/* Rhythm blocks overlay */}
        <RhythmBlocks
          blocks={rhythmBlocks}
          currentTime={currentTime}
          enabled={rhythmHintsEnabled}
          mode={mode}
        />
      </div>
      
      {/* Game buttons - only show if not in freeplay mode */}
      {mode !== 'freeplay' && (
        <div className="py-6 bg-background border-t border-border">
          <GameButtons
            onButtonPress={handleButtonPress}
            onButtonRelease={handleButtonRelease}
            activeButtons={activeButtons}
            mode={mode}
          />
        </div>
      )}
      
      {/* Settings dialog */}
      <Settings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        rhythmHintsEnabled={rhythmHintsEnabled}
        onRhythmHintsChange={setRhythmHintsEnabled}
      />
    </div>
  );
}
