import { Music, Piano } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Song } from '../App';

interface SongSelectionProps {
  onSelectSong: (song: Song) => void;
  onFreeplay: () => void;
}

const songs: Song[] = [
  { 
    id: '1', 
    title: 'Für Elise', 
    artist: 'Beethoven', 
    difficulty: 'Easy', 
    duration: '2:30',
    availableModes: ['pneno', 'tapArr', 'piCo']
  },
  { 
    id: '2', 
    title: 'Moonlight Sonata', 
    artist: 'Beethoven', 
    difficulty: 'Medium', 
    duration: '5:45',
    availableModes: ['tapArr', 'piCo']
  },
  { 
    id: '3', 
    title: 'Canon in D', 
    artist: 'Pachelbel', 
    difficulty: 'Easy', 
    duration: '4:20',
    availableModes: ['pneno', 'tapArr']
  },
  { 
    id: '4', 
    title: 'Turkish March', 
    artist: 'Mozart', 
    difficulty: 'Medium', 
    duration: '3:15',
    availableModes: ['tapArr', 'piCo']
  },
  { 
    id: '5', 
    title: 'Clair de Lune', 
    artist: 'Debussy', 
    difficulty: 'Hard', 
    duration: '5:00',
    availableModes: ['piCo']
  },
  { 
    id: '6', 
    title: 'The Entertainer', 
    artist: 'Joplin', 
    difficulty: 'Medium', 
    duration: '3:45',
    availableModes: ['pneno', 'tapArr', 'piCo']
  },
  { 
    id: '7', 
    title: 'Prelude in C Major', 
    artist: 'Bach', 
    difficulty: 'Easy', 
    duration: '2:15',
    availableModes: ['pneno', 'tapArr']
  },
  { 
    id: '8', 
    title: 'Nocturne Op. 9 No. 2', 
    artist: 'Chopin', 
    difficulty: 'Hard', 
    duration: '4:30',
    availableModes: ['tapArr', 'piCo']
  },
];

const difficultyColors = {
  Easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
  Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  Hard: 'bg-red-500/20 text-red-700 dark:text-red-400',
};

export function SongSelection({ onSelectSong, onFreeplay }: SongSelectionProps) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Select a Song</h1>
          <p className="text-muted-foreground">Choose a piece to practice</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {songs.map(song => (
            <Card
              key={song.id}
              className="p-6 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onSelectSong(song)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 truncate">{song.title}</h3>
                  <p className="text-muted-foreground mb-2">{song.artist}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-sm ${difficultyColors[song.difficulty]}`}>
                      {song.difficulty}
                    </span>
                    <span className="text-sm text-muted-foreground">{song.duration}</span>
                    <span className="text-xs text-muted-foreground">
                      {song.availableModes.length} mode{song.availableModes.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={onFreeplay}
            className="gap-2"
          >
            <Piano className="w-5 h-5" />
            Freeplay Mode
          </Button>
        </div>
      </div>
    </div>
  );
}
