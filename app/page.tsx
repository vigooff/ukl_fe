
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="bg-[#181A20] text-[#F3F4F6] font-sans min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Playlist */}
        <aside className="w-64 bg-[#1F222A] p-6 overflow-y-auto border-r border-[#23262F] flex flex-col">
          <h2 className="text-2xl font-bold mb-8 tracking-tight text-[#F3F4F6]">Playlist</h2>
          {loading ? (
            <div className="text-[#A1A1AA] animate-pulse">Loading...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <div className="space-y-3">
              {playlists.map((playlist, i) => (
                <motion.div
                  key={playlist.uuid}
                  whileHover={{ scale: 1.04, backgroundColor: "#23262F" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-3 rounded-lg cursor-pointer flex flex-col gap-1 group"
                  onClick={() => {
                    // Animasi keluar sebelum pindah page
                    window.location.href = `/playlist?playlist_id=${playlist.uuid}`;
                  }}
                >
                  <span className="font-semibold text-[#F3F4F6] group-hover:text-[#7EE787] transition-colors duration-200">{playlist.playlist_name}</span>
                  <span className="text-xs text-[#A1A1AA]">{playlist.song_count} lagu</span>
                </motion.div>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          <AnimatePresence>
            <motion.div
              key="main-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full flex flex-col items-center justify-center px-4"
            >
              <motion.h1
                className="text-5xl font-extrabold mb-4 tracking-tight text-center bg-gradient-to-r from-[#7EE787] via-[#A5D6FF] to-[#7EE787] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Temukan Musik Favoritmu
              </motion.h1>
              <motion.p
                className="text-lg text-[#A1A1AA] mb-10 text-center max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Dengarkan lagu, kelola playlist, dan nikmati pengalaman musik minimalis, modern, dan elegan.
              </motion.p>
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <span className="text-[#7EE787] text-base font-medium animate-pulse">Pilih playlist di samping untuk mulai mendengarkan!</span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {/* Footer/Player Placeholder */}
      <footer className="h-16 bg-[#1F222A] border-t border-[#23262F] flex items-center justify-center text-[#A1A1AA] text-sm tracking-wide">
        <span>© {new Date().getFullYear()} Your Music App</span>
      </footer>
    </div>
  );
}
