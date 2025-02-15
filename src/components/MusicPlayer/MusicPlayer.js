import React, { useState, useRef } from "react";
import "./MusicPlayer.css";

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = async () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Play interrupted:", error);
      }
    }
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} loop>
        <source
          src="https://www.example.com/ambient-rain.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
      <button onClick={togglePlay}>
        {isPlaying ? "Pause Ambient" : "Play Ambient"}
      </button>
    </div>
  );
}

export default MusicPlayer;
