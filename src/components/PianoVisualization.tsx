import { useEffect, useRef } from 'react';

interface MidiEvent {
  id: string;
  pitch: number; // 0-87 (88 keys)
  velocity: number;
  startTime: number;
  endTime: number | null;
  color: string;
}

interface PianoVisualizationProps {
  midiEvents: MidiEvent[];
  currentTime: number;
}

export function PianoVisualization({ midiEvents, currentTime }: PianoVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Piano key dimensions - will be calculated based on canvas width
  const keyHeight = 60;
  
  // Flow speed (pixels per second)
  const flowSpeed = 200;
  
  // Get white key positions (88 keys total, starting from A0)
  const getKeyInfo = (keyIndex: number) => {
    const octavePattern = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]; // which white key in octave
    const isBlack = [false, true, false, true, false, false, true, false, true, false, true, false];
    
    // A0 starts at index 0
    const noteInOctave = (keyIndex + 9) % 12; // Shift to start from C
    const octave = Math.floor((keyIndex + 9) / 12);
    
    const isBlackKey = isBlack[noteInOctave];
    
    // Count white keys before this one
    let whiteKeysBefore = 0;
    for (let i = 0; i < keyIndex; i++) {
      const note = (i + 9) % 12;
      if (!isBlack[note]) whiteKeysBefore++;
    }
    
    return {
      isBlack: isBlackKey,
      whiteKeyIndex: whiteKeysBefore,
    };
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Calculate key dimensions based on canvas width
    const numWhiteKeys = 52; // 88 keys = 52 white + 36 black
    const whiteKeyWidth = rect.width / numWhiteKeys;
    const blackKeyWidth = whiteKeyWidth * 0.6;
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Draw flowing MIDI events
    midiEvents.forEach(event => {
      const keyInfo = getKeyInfo(event.pitch);
      const x = keyInfo.whiteKeyIndex * whiteKeyWidth + (keyInfo.isBlack ? whiteKeyWidth / 2 - blackKeyWidth / 2 : 0);
      const width = keyInfo.isBlack ? blackKeyWidth : whiteKeyWidth;
      
      // Calculate position based on time
      if (event.endTime === null) {
        // Note is still playing - draw from piano keys upward
        const noteDuration = currentTime - event.startTime;
        const noteHeight = noteDuration * flowSpeed;
        const y = rect.height - keyHeight - noteHeight;
        
        if (y < rect.height - keyHeight && y + noteHeight > 0) {
          ctx.fillStyle = event.color;
          ctx.globalAlpha = 0.8;
          ctx.fillRect(x, Math.max(0, y), width - 1, Math.min(noteHeight, rect.height - keyHeight));
          ctx.globalAlpha = 1;
        }
      } else {
        // Note has ended - flow upward
        const startY = rect.height - keyHeight - (currentTime - event.startTime) * flowSpeed;
        const endY = rect.height - keyHeight - (currentTime - event.endTime) * flowSpeed;
        const height = endY - startY;
        
        // Only draw if visible
        if (endY > 0 && startY < rect.height - keyHeight) {
          ctx.fillStyle = event.color;
          ctx.globalAlpha = 0.8;
          ctx.fillRect(x, startY, width - 1, height);
          ctx.globalAlpha = 1;
        }
      }
    });
    
    // Draw piano keys at bottom
    // Draw white keys
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    for (let i = 0; i < numWhiteKeys; i++) {
      const x = i * whiteKeyWidth;
      ctx.fillRect(x, rect.height - keyHeight, whiteKeyWidth, keyHeight);
      ctx.strokeRect(x, rect.height - keyHeight, whiteKeyWidth, keyHeight);
    }
    
    // Draw black keys
    ctx.fillStyle = '#000000';
    const blackKeyPattern = [1, 2, 4, 5, 6]; // positions in each octave
    for (let octave = 0; octave < 8; octave++) {
      blackKeyPattern.forEach(pos => {
        const whiteKeyIndex = octave * 7 + pos;
        if (whiteKeyIndex < numWhiteKeys - 1) {
          const x = whiteKeyIndex * whiteKeyWidth + whiteKeyWidth - blackKeyWidth / 2;
          ctx.fillRect(x, rect.height - keyHeight, blackKeyWidth, keyHeight * 0.6);
        }
      });
    }
    
  }, [midiEvents, currentTime]);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
