import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { PianoVisualization } from './PianoVisualization';
import { GameButtons } from './GameButtons';
import { RhythmBlocks } from './RhythmBlocks';
import { Settings } from './Settings';

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
  onBack: () => void;
}

const buttonColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

// Map button index to MIDI pitch (around middle C for demo)
const buttonToMidi = [60, 62, 64, 65, 67, 69, 71, 72]; // C, D, E, F, G, A, B, C

export function PianoPlayer({ songTitle, onBack }: PianoPlayerProps) {
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
    if (rhythmHintsEnabled && rhythmBlocks.length === 0) {
      // Generate some demo rhythm blocks
      const blocks: RhythmBlock[] = [];
      const startTime = currentTime + 1;
      
      for (let i = 0; i < 20; i++) {
        const lane = Math.floor(Math.random() * 8);
        blocks.push({
          id: `block-${i}`,
          lane,
          timestamp: startTime + i * 0.5,
          color: buttonColors[lane],
        });
      }
      
      setRhythmBlocks(blocks);
    }
  }, [rhythmHintsEnabled, currentTime]);
  
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
  }, [currentTime]);
  
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
  }, [currentTime]);
  
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
        
        <h2>{songTitle}</h2>
        
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
        />
      </div>
      
      {/* Game buttons */}
      <div className="py-6 bg-background border-t border-border">
        <GameButtons
          onButtonPress={handleButtonPress}
          onButtonRelease={handleButtonRelease}
          activeButtons={activeButtons}
        />
      </div>
      
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
