import React from "react";
import "./songplayer.css";

function SongPlayer({
  song,
  onNext,
  onPrevious,
  isPlaying,
  isFirstSong,
  accessToken,
  setIsPlaying,
}) {
  const spotifyApiBaseUrl = "https://api.spotify.com/v1";
  const devId = "e109d48eaaa1aa190571b9f52195a9ce6b997667";

  console.log("Device ID:", devId);
  // console.log("Using Access Token:", accessToken);

  async function playSong(accessToken, deviceId, trackUri) {
    const playEndpoint = `${spotifyApiBaseUrl}/me/player/play?device_id=${devId}`;
    await fetch(playEndpoint, {
      method: "PUT",
      body: JSON.stringify({ uris: [trackUri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async function pauseSong(accessToken) {
    const pauseEndpoint = `${spotifyApiBaseUrl}/me/player/pause`;
    await fetch(pauseEndpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  const handlePlayPause = async () => {
    if (isPlaying) {
      await pauseSong(accessToken);
    } else {
      await playSong(accessToken, devId, song.uri);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="song-player">
      <img src={song.image} alt={song.name} className="song-image" />
      <div className="song-info">
        <h3>{song.name}</h3>
      </div>
      <div className="song-info">
        <h3>{song.artist}</h3>
      </div>
      <div className="player-controls">
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}

export default SongPlayer;
