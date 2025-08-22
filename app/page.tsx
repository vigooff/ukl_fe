
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Playlist {
  uuid: string;
  playlist_name: string;
  song_count: number;
}

export default function Home() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get("https://learn.smktelkom-mlg.sch.id/ukl2/playlists");
        if (response.data.success) {
          setPlaylists(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Gagal memuat playlist");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  return (
    <div className="bg-black text-white font-sans h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Playlist */}
        <aside className="w-64 bg-black p-4 overflow-y-auto border-r border-gray-800">
          <h2 className="text-xl font-bold mb-6">Your Library</h2>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <div
                  key={playlist.uuid}
                  className="p-2 rounded-md cursor-pointer hover:bg-gray-800"
                  onClick={() => window.location.href = `/playlist?playlist_id=${playlist.uuid}`}
                >
                  <h3 className="font-medium">{playlist.playlist_name}</h3>
                  <p className="text-sm text-gray-400">{playlist.song_count} songs</p>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Music</h1>
          <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
            Temukan dan dengarkan lagu favoritmu, kelola playlist, dan nikmati pengalaman seperti Spotify dengan tampilan modern dan konsisten.
          </p>
          <div className="flex flex-col items-center gap-4">
            <span className="text-gray-400">Pilih playlist di samping untuk mulai mendengarkan!</span>
          </div>
        </main>
      </div>
      {/* Footer/Player Placeholder */}
      <footer className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-center text-gray-500">
        <span>© {new Date().getFullYear()} Your Music App</span>
      </footer>
    </div>
  );
}
