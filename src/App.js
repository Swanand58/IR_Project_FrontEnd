import "./App.css";
import React, { useState, useEffect } from "react";
import SearchBar from "./components/searchbar";
import SongPlayer from "./components/songplayer";
import RecommendedSongs from "./components/recommended";

function App() {
  const [currentSong, setCurrentSong] = useState(null); // Holds the current song's details
  const [lastQuery, setLastQuery] = useState(""); // Tracks the last search query
  const [isPlaying, setIsPlaying] = useState(false);
  const [recommendedSongs, setRecommendedSongs] = useState([]);

  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const fetchAccessToken = async () => {
      setAccessToken(
        "BQCNDPnkBc2g2t9FVrPaAt0kzAHgG87f93pZ387qAh3fTuj1Jdg6MhtIZA_3Y_QPsjMDQUMDvcTQ5mhUEcUEyC2ahXJB3Ci1qQxv_eDMqcTLw-8gE8o"
      );
    };

    fetchAccessToken();
  }, []);

  const handleLogin = () => {
    const clientId = "d491d8d1fb704aecbfacf6df5d0b193e";
    const redirectUri = "http://localhost:3000/"; // Make sure this matches the one set in Spotify Dashboard
    const scopes = ["user-modify-playback-state"];
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes.join(" "))}&show_dialog=true`;

    window.location.href = authUrl;
  };

  async function handleSearch(query) {
    setLastQuery(query);
    // const accessToken =
    //   "BQAdld4pMsk0zZeTOJenKdfzyq7VmvpFXqEmGiWdxJOcPYh-e12bhGPrkzm6nDujZk3nPQLdbbGYdYnri51TVk4I4JjICBGgRmKwuNzvRyk24zEXfVQ";

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    if (data.tracks && data.tracks.items.length > 0) {
      const track = data.tracks.items[0];
      setCurrentSong({
        id: track.id,
        name: track.name,
        image: track.album.images[0].url,
        artist: track.artists.map((artist) => artist.name).join(", "),
      });

      fetchRecommendedSongs(track.name);
    } else {
      setCurrentSong(null);
      setRecommendedSongs([]);
      console.log("failed getting song details");
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // if (!isPlaying && currentSong) {
    //   fetchRecommendedSongs(currentSong.name);
    // }
  };

  async function fetchRecommendedSongs(songName) {
    try {
      const headers = new Headers({
        "Content-Type": "application/json",
      });

      const body = JSON.stringify({
        song_name: songName,
      });

      const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: headers,
        body: body,
      });

      const data = await response.json();
      if (response.ok) {
        const detailedSongs = await Promise.all(
          data.recommended_songs.map(async (song) => {
            const spotifyResponse = await fetch(
              `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                song
              )}&type=track&limit=1`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const spotifyData = await spotifyResponse.json();
            if (spotifyData.tracks && spotifyData.tracks.items.length > 0) {
              const trackDetails = spotifyData.tracks.items[0];
              return {
                name: trackDetails.name,
                artist: trackDetails.artists
                  .map((artist) => artist.name)
                  .join(", "),
                image: trackDetails.album.images[0].url,
                id: trackDetails.id,
              };
            } else {
              return null;
            }
          })
        );

        setRecommendedSongs(detailedSongs.filter((song) => song)); // Filter out any null values if a song wasn't found
      }
    } catch (error) {
      console.error("Failed to fetch recommended songs:", error);
    }
  }

  const handleNext = () => {
    // setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrevious = () => {
    // setCurrentSongIndex(
    //   (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
    // );
  };

  function handleSelectRecommendedSong(song) {
    handleSearch(song.name);
  }

  return (
    <div className="App">
      <h1>Music Recommendation System</h1>
      <h3>Based on Audio Analysis of Songs</h3>

      <SearchBar onSearch={handleSearch} />
      {lastQuery && <div>Results for: {lastQuery}</div>}

      {currentSong && (
        <div>
          <SongPlayer
            song={currentSong}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            accessToken={accessToken}
          />
          <RecommendedSongs
            songs={recommendedSongs}
            onSelectSong={handleSelectRecommendedSong}
          />
        </div>
      )}
    </div>
  );
}

export default App;
