import React from "react";
import "./recommend.css";

function RecommendedSongs({ songs, onSelectSong }) {
  return (
    <div className="recommended-songs-container">
      <h2>Recommended Songs</h2>
      <div className="recommended-songs-list">
        {songs.map((song, index) => (
          <div
            key={index}
            className="song-tile"
            onClick={() => onSelectSong(song)}
          >
            <img src={song.image} alt={song.name} className="song-image" />
            <div className="song-details">
              <div className="song-name">{song.name}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default RecommendedSongs;
