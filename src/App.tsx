import { useState } from "react";
import { SongSelection } from "./components/SongSelection";
import { PianoPlayer } from "./components/PianoPlayer";
import { ModeSelection, GameMode } from "./components/ModeSelection";

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  availableModes: GameMode[];
}

type AppState =
  | { screen: "selection" }
  | { screen: "mode"; song: Song }
  | { screen: "player"; song: Song; mode: GameMode };

export default function App() {
  const [state, setState] = useState<AppState>({ screen: "selection" });

  const handleSelectSong = (song: Song) => {
    setState({ screen: "mode", song });
  };

  const handleSelectMode = (mode: GameMode) => {
    if (state.screen === "mode") {
      setState({ screen: "player", song: state.song, mode });
    }
  };

  const handleFreeplay = () => {
    setState({
      screen: "player",
      song: {
        id: "freeplay",
        title: "Freeplay",
        artist: "",
        difficulty: "Easy",
        duration: "∞",
        availableModes: ["freeplay"],
      },
      mode: "freeplay",
    });
  };

  const handleBackToSelection = () => {
    setState({ screen: "selection" });
  };

  const handleBackToMode = () => {
    if (state.screen === "player") {
      setState({ screen: "mode", song: state.song });
    }
  };

  return (
    <div className="size-full">
      {state.screen === "selection" && (
        <SongSelection
          onSelectSong={handleSelectSong}
          onFreeplay={handleFreeplay}
        />
      )}

      {state.screen === "mode" && (
        <ModeSelection
          songTitle={`${state.song.title} - ${state.song.artist}`}
          availableModes={state.song.availableModes}
          onSelectMode={handleSelectMode}
          onBack={handleBackToSelection}
        />
      )}

      {state.screen === "player" && (
        <PianoPlayer
          songTitle={
            state.mode === "freeplay"
              ? "Freeplay"
              : `${state.song.title} - ${state.song.artist}`
          }
          mode={state.mode}
          availableModes={state.song.availableModes}
          onBack={
            state.mode === "freeplay" ? handleBackToSelection : handleBackToMode
          }
          onModeChange={handleSelectMode}
        />
      )}
    </div>
  );
}
