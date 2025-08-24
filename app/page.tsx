
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile sidebar

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
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-[#23262F] text-[#7EE787] p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7EE787]"
        aria-label={sidebarOpen ? 'Tutup Playlist' : 'Buka Playlist'}
        onClick={() => setSidebarOpen((v) => !v)}
      >
        {sidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 18h16.5" />
          </svg>
        )}
      </button>
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar Playlist */}
        <aside
          className={`
            bg-[#1F222A] border-b md:border-b-0 md:border-r border-[#23262F] z-20
            flex flex-row md:flex-col gap-4 md:gap-0 sticky top-0
            w-64 md:w-64 p-4 md:p-6 overflow-x-auto md:overflow-y-auto
            transition-transform duration-300 ease-in-out
            fixed md:static h-full md:h-auto left-0 top-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
            md:w-64
            md:relative
            md:flex
            shadow-lg md:shadow-none
          `}
          style={{ maxWidth: '100vw' }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 tracking-tight text-[#F3F4F6] flex-shrink-0">Playlist</h2>
          {loading ? (
            <div className="text-[#A1A1AA] animate-pulse">Loading...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <div className="flex flex-row md:flex-col gap-3 w-full overflow-x-auto md:overflow-x-visible">
              {playlists.map((playlist, i) => (
                <motion.div
                  key={playlist.uuid}
                  whileHover={{ scale: 1.04, backgroundColor: "#23262F" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-3 rounded-lg cursor-pointer flex flex-col gap-1 group min-w-[140px] md:min-w-0"
                  onClick={() => {
                    window.location.href = `/playlist?playlist_id=${playlist.uuid}`;
                    if (window.innerWidth < 768) setSidebarOpen(false); // auto-hide on mobile after select
                  }}
                >
                  <span className="font-semibold text-[#F3F4F6] group-hover:text-[#7EE787] transition-colors duration-200 truncate">{playlist.playlist_name}</span>
                  <span className="text-xs text-[#A1A1AA]">{playlist.song_count} lagu</span>
                </motion.div>
              ))}
            </div>
          )}
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup Playlist"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-8 md:py-0">
          <AnimatePresence>
            <motion.div
              key="main-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full flex flex-col items-center justify-center px-2 sm:px-4"
            >
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 md:mb-4 tracking-tight text-center bg-gradient-to-r from-[#7EE787] via-[#A5D6FF] to-[#7EE787] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Temukan Musik Favoritmu
              </motion.h1>
              <motion.p
                className="text-base sm:text-lg text-[#A1A1AA] mb-6 md:mb-10 text-center max-w-xs sm:max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Dengarkan lagu, kelola playlist, dan nikmati pengalaman musik minimalis, modern, dan elegan.
              </motion.p>
              <motion.div
                className="flex flex-col items-center gap-3 md:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <span className="text-[#7EE787] text-sm sm:text-base font-medium animate-pulse text-center">Pilih playlist di samping untuk mulai mendengarkan!</span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {/* Footer/Player Placeholder */}
      <footer className="h-14 md:h-16 bg-[#1F222A] border-t border-[#23262F] flex items-center justify-center text-[#A1A1AA] text-xs md:text-sm tracking-wide px-2 text-center">
        <span>© {new Date().getFullYear()} Your Music App</span>
      </footer>
    </div>
  );
}
