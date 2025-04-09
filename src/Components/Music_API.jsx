import React, { useState, useCallback } from "react";
import axios from "axios";
import { Search, Download, Pause, Play, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem } from "./DropdownMenu";

const Music_API = () => {
  const [input, setInput] = useState("");
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [playingTrack, setPlayingTrack] = useState(null);

  const handleSearch = async () => {
    if (!input.trim()) {
      setError("Please enter a song!");
      return;
    }

    setLoading(true);
    setError("");
    setSongs([]);

    try {
      const { data } = await axios.get(
        `https://saavn.dev/api/search/songs?query=${input}`
      );

      if (data?.data?.results?.length) {
        setSongs(data.data.results);
      } else {
        setError("Song Not Found!");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to fetch songs!");
    } finally {
      setLoading(false);
    }
  };

  const downloadSong = useCallback(async (songName, audioUrl) => {
    if (!audioUrl) {
      console.error("No download URL available");
      return;
    }

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${songName}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      
      <div className="sticky top-0 z-10 bg-gray-900 p-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Music Player</h1>

          <div className="flex">
            <input
              type="text"
              placeholder="Search for songs..."
              className="flex-1 px-4 py-2 rounded-l bg-gray-800 border border-gray-700 focus:outline-none"
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              value={input}
            />
            <button
              className="px-4 py-2 bg-green-600 rounded-r hover:bg-green-700"
              onClick={handleSearch}
              disabled={loading}
            >
              <Search size={20} />
            </button>
          </div>

          {error && <div className="text-red-400 mt-2">{error}</div>}
        </div>
      </div>

      
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {songs.map((song, index) => {
            const audioUrl = song.downloadUrl?.[song.downloadUrl.length - 1]?.url;
            const isPlaying = playingTrack === song.id;

            return (
              <div key={song.id || index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="relative mb-3">
                  <img
                    src={song.image[song.image.length - 1]?.url || "https://via.placeholder.com/150"}
                    alt={song.name}
                    className="w-full aspect-square object-cover rounded"
                  />
                  {audioUrl && (
                    <button
                      onClick={() => setPlayingTrack(isPlaying ? null : song.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      {isPlaying ? (
                        <Pause size={40} className="text-white" />
                      ) : (
                        <Play size={40} className="text-white" />
                      )}
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-start relative">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{song.name}</h3>
                    <p className="text-gray-400 text-sm truncate">
                      {song.artists?.primary?.map(artist => artist.name).join(", ") || "Unknown Artist"}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownTrigger>
                      <MoreVertical
                        size={20}
                        className="text-gray-400 hover:text-white ml-2"
                      />
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem onClick={() => downloadSong(song.name, audioUrl)}>
                        <div className="flex items-center gap-2">
                          <Download size={16} />
                          Download
                        </div>
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </div>


                {audioUrl && (
                  <audio
                    controls
                    className="w-full mt-3"
                    onPlay={() => setPlayingTrack(song.id)}
                    onPause={() => setPlayingTrack(null)}
                  >
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Music_API;