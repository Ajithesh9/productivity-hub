import React, { useState, useRef } from "react";
import "./MusicPlayer.css";

// Import icons from your assets folder (adjusted paths)
import prevIcon from "../../assets/icons/prev.svg";
import playIcon from "../../assets/icons/play.svg";
import pauseIcon from "../../assets/icons/pause.svg";
import nextIcon from "../../assets/icons/next.svg";

// Import music files from your assets folder (adjusted paths)
import rainyDayTrack from "../../assets/music/Rainy Day.mp3";

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0); // 0: Ocean, 1: Rainy Day, 2: Waterfall, 3: Fan sound
  const audioRef = useRef(null);

  // Define the tracks with names matching the file names (without extension)
  const tracks = [{ name: "Rainy Day", src: rainyDayTrack }];

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

  const changeTrack = (index) => {
    audioRef.current.src = tracks[index].src;
    // Ensure volume remains at 40%
    audioRef.current.volume = 0.4;
    if (isPlaying) {
      // Auto-play the new track if one was already playing
      audioRef.current.play();
    }
  };

  return (
    <div className={`music-player ${isPlaying ? "playing" : ""}`}>
      <audio ref={audioRef} loop>
        <source src={tracks[currentTrack].src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Compact Icon */}
      <div className="compact-icon"></div>

      {/* Track Info */}
      <div className="track-info">{tracks[currentTrack].name}</div>

      {/* Controls */}
      <div className="controls">
        <button
          onClick={() =>
            changeTrack((currentTrack - 1 + tracks.length) % tracks.length)
          }
        >
          <img src={prevIcon} alt="Previous" />
        </button>
        <button onClick={togglePlay}>
          <img
            src={isPlaying ? pauseIcon : playIcon}
            alt={isPlaying ? "Pause" : "Play"}
          />
        </button>
        <button onClick={() => changeTrack((currentTrack + 1) % tracks.length)}>
          <img src={nextIcon} alt="Next" />
        </button>
      </div>
    </div>
  );
}

export default MusicPlayer;
