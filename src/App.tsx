import { useState } from 'react';
import { SongSelection } from './components/SongSelection';
import { PianoPlayer } from './components/PianoPlayer';

interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
}

export default function App() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  
  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
  };
  
  const handleBack = () => {
    setSelectedSong(null);
  };
  
  return (
    <div className="size-full">
      {selectedSong ? (
        <PianoPlayer
          songTitle={`${selectedSong.title} - ${selectedSong.artist}`}
          onBack={handleBack}
        />
      ) : (
        <SongSelection onSelectSong={handleSelectSong} />
      )}
    </div>
  );
}
