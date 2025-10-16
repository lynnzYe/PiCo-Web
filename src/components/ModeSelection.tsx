import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export type GameMode = 'pneno' | 'tapArr' | 'piCo' | 'freeplay';

interface ModeInfo {
  id: GameMode;
  name: string;
  description: string;
  buttonCount: number;
}

interface ModeSelectionProps {
  songTitle: string;
  availableModes: GameMode[];
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

const modeInfoMap: Record<GameMode, ModeInfo> = {
  pneno: {
    id: 'pneno',
    name: 'Pneno',
    description: 'Four-button mode with simplified controls',
    buttonCount: 4,
  },
  tapArr: {
    id: 'tapArr',
    name: 'TapArr',
    description: 'Eight-button mode with MIDI-aware arrangement',
    buttonCount: 8,
  },
  piCo: {
    id: 'piCo',
    name: 'PiCo',
    description: 'Eight-button mode with intelligent composition',
    buttonCount: 8,
  },
  freeplay: {
    id: 'freeplay',
    name: 'Freeplay',
    description: 'No buttons - just play freely on the piano',
    buttonCount: 0,
  },
};

export function ModeSelection({
  songTitle,
  availableModes,
  onSelectMode,
  onBack,
}: ModeSelectionProps) {
  const allModes: GameMode[] = ['pneno', 'tapArr', 'piCo'];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Songs
          </Button>
          <h1 className="mb-2">Select Mode</h1>
          <p className="text-muted-foreground">{songTitle}</p>
        </div>

        <div className="grid gap-4">
          {allModes.map((mode) => {
            const modeInfo = modeInfoMap[mode];
            const isAvailable = availableModes.includes(mode);

            return (
              <Card
                key={mode}
                className={`p-6 transition-all ${
                  isAvailable
                    ? 'cursor-pointer hover:bg-accent hover:shadow-lg'
                    : 'opacity-40 cursor-not-allowed'
                }`}
                onClick={() => isAvailable && onSelectMode(mode)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2>{modeInfo.name}</h2>
                      {!isAvailable && (
                        <span className="px-2 py-1 rounded text-sm bg-muted text-muted-foreground">
                          Not Available
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {modeInfo.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {modeInfo.buttonCount === 0
                          ? 'No buttons'
                          : `${modeInfo.buttonCount} buttons`}
                      </span>
                      {modeInfo.buttonCount > 0 && (
                        <span className="text-muted-foreground">
                          {modeInfo.buttonCount === 4 ? 'H J K L keys' : 'A S D F + H J K L keys'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
