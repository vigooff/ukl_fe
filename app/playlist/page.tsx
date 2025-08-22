"use client";


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
const SongDetailContent = dynamic(() => import('../detail/SongDetailContent'), { ssr: false });

interface Song {
  uuid: string;
  title: string;
  artist: string;
  description: string;
  source: string;
  thumbnail: string;
  likes: number;
  comments: {
    comment_text: string;
    creator: string;
    createdAt: string;
  }[];
}

interface Playlist {
  uuid: string;
  playlist_name: string;
  song_count: number;
}

interface ApiResponse {
  success: boolean;
  data: Playlist[];
  message: string;
}

interface SongListResponse {
  success: boolean;
  data: Song[];
  message: string;
}

// Fallback thumbnail SVG as base64
const fallbackThumbnailSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM0YjUwNjMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

// Lebih toleran: jika sudah URL, pakai langsung. Jika nama file, gabungkan dengan base URL. Jika kosong, fallback.
const getThumbnailUrl = (thumbnail: string | undefined | null): string => {
  if (!thumbnail || thumbnail.trim() === "") return fallbackThumbnailSrc;
  const value = thumbnail.trim();
  // Jika sudah URL lengkap (http/https), pakai langsung
  if (/^https?:\/\//i.test(value)) return value;
  // Jika hanya nama file (misal: abc.jpg), gabungkan dengan base URL
  return `https://learn.smktelkom-mlg.sch.id/ukl2/thumbnail/${encodeURIComponent(value)}`;
};

const PlaylistPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playlistId = searchParams.get('playlist_id');
  const searchQuery = searchParams.get('search') || '';

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(playlistId);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>(searchQuery);
  const [tempSearchInput, setTempSearchInput] = useState<string>(searchQuery);

  // Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get<ApiResponse>('https://learn.smktelkom-mlg.sch.id/ukl2/playlists');
        if (response.data.success) {
          setPlaylists(response.data.data);
          if (!selectedPlaylist && response.data.data.length > 0) {
            setSelectedPlaylist(response.data.data[0].uuid);
          }
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Error fetching playlists');
        console.error('Error:', err);
      }
    };

    fetchPlaylists();
  }, []);

  // Fetch songs when playlist or search input changes
  useEffect(() => {
    if (selectedPlaylist) {
      const fetchSongs = async () => {
        setLoading(true);
        try {
          let url = `https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song-list/${selectedPlaylist}`;
          if (searchInput) {
            url += `?search=${encodeURIComponent(searchInput)}`;
          }
          
          const response = await axios.get<SongListResponse>(url);
          if (response.data.success) {
            setSongs(response.data.data);
            setFilteredSongs(response.data.data);
            if (response.data.data.length > 0) {
              setCurrentSong(response.data.data[0]);
            }
            
            // Debug: log thumbnail URLs
            console.log('Songs loaded with thumbnails:', 
              response.data.data.map(song => ({
                title: song.title,
                originalThumbnail: song.thumbnail,
                generatedUrl: getThumbnailUrl(song.thumbnail)
              }))
            );
          } else {
            setError(response.data.message);
          }
        } catch (err) {
          setError('Error fetching songs');
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchSongs();
    }
  }, [selectedPlaylist, searchInput]);

  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylist(playlistId);
    setSearchInput('');
    setTempSearchInput('');
    router.push(`/playlist?playlist_id=${playlistId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = tempSearchInput.trim();
    setSearchInput(trimmedInput);
    router.push(`/playlist?playlist_id=${selectedPlaylist}${trimmedInput ? `&search=${encodeURIComponent(trimmedInput)}` : ''}`);
  };

  // Robust image error handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const imgElement = e.currentTarget;
    
    // Only replace if not already fallback and not marked with data-error
    if (imgElement.src !== fallbackThumbnailSrc && !imgElement.hasAttribute('data-error')) {
      console.warn('Image failed to load, using fallback:', imgElement.src);
      imgElement.src = fallbackThumbnailSrc;
      imgElement.setAttribute('data-error', 'true');
    }
  };

  return (
    <>
      <div className="bg-[#181A20] text-[#F3F4F6] font-sans min-h-screen flex flex-col">
        <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Playlist */}
        <aside className="w-64 bg-[#1F222A] p-6 overflow-y-auto border-r border-[#23262F] flex flex-col">
          {/* Navigasi Home */}
          <div className="flex flex-col gap-6 mb-8">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#7EE787] transition-colors text-lg font-bold mb-2"
              title="Kembali ke Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12L12 4l9 8M4.5 10.5V19a2.5 2.5 0 002.5 2.5h2A2.5 2.5 0 0011.5 19V15a2.5 2.5 0 012.5-2.5h0A2.5 2.5 0 0116.5 15v4a2.5 2.5 0 002.5 2.5h2A2.5 2.5 0 0021 19v-8.5" />
              </svg>
              <span className="hidden md:inline">Home</span>
            </button>
            <h2 className="text-2xl font-bold tracking-tight text-[#F3F4F6]">Playlist</h2>
          </div>
          <div className="space-y-3">
            {playlists.map((playlist) => (
              <motion.div
                key={playlist.uuid}
                whileHover={{ scale: 1.04, backgroundColor: "#23262F" }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`p-3 rounded-lg cursor-pointer flex flex-col gap-1 group ${selectedPlaylist === playlist.uuid ? 'bg-[#23262F]' : ''}`}
                onClick={() => handlePlaylistClick(playlist.uuid)}
              >
                <span className="font-semibold text-[#F3F4F6] group-hover:text-[#7EE787] transition-colors duration-200">{playlist.playlist_name}</span>
                <span className="text-xs text-[#A1A1AA]">{playlist.song_count} lagu</span>
              </motion.div>
            ))}
          </div>
        </aside>

        {/* Middle Content - Songs */}
        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-[#23262F] to-[#181A20]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7EE787]"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center">{error}</div>
          ) : (
            <>
              {/* Navigasi Back/Forward */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-full bg-[#23262F] hover:bg-[#7EE787] hover:text-[#181A20] transition-colors"
                  title="Kembali"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={() => router.forward && router.forward()}
                  className="p-2 rounded-full bg-[#23262F] hover:bg-[#7EE787] hover:text-[#181A20] transition-colors"
                  title="Maju"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-[#F3F4F6]">
                  {playlists.find(p => p.uuid === selectedPlaylist)?.playlist_name || 'Playlist'}
                </h1>
                <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Cari lagu..."
                    value={tempSearchInput}
                    onChange={(e) => setTempSearchInput(e.target.value)}
                    className="bg-[#23262F] text-[#F3F4F6] px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#7EE787] w-full sm:w-64 border border-[#23262F]"
                  />
                  <button
                    type="submit"
                    className="bg-[#7EE787] hover:bg-[#A5D6FF] px-4 py-2 rounded-r-md flex items-center justify-center text-[#181A20] font-semibold transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </form>
              </div>
              <div className="mb-8">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[#A1A1AA] border-b border-[#23262F] text-xs uppercase tracking-wider">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Judul</div>
                  <div className="col-span-4">Artis</div>
                  <div className="col-span-2 text-right">Likes</div>
                </div>
                <AnimatePresence>
                  {filteredSongs.length > 0 ? (
                    filteredSongs.map((song, index) => (
                      <motion.div
                        key={song.uuid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                        className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg cursor-pointer items-center hover:bg-[#23262F] transition-colors duration-200 ${currentSong?.uuid === song.uuid ? 'bg-[#23262F]' : ''}`}
                        onClick={() => setSelectedSong(song)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="col-span-1 text-[#A1A1AA] font-mono">{index + 1}</div>
                        <div className="col-span-5 font-medium flex items-center gap-3">
                          <motion.img
                            src={getThumbnailUrl(song.thumbnail)}
                            alt={`${song.title} thumbnail`}
                            className="w-10 h-10 rounded-md object-cover shadow-md border border-[#23262F]"
                            onError={handleImageError}
                            loading="lazy"
                            whileHover={{ scale: 1.08 }}
                          />
                          <span className="truncate">{song.title}</span>
                        </div>
                        <div className="col-span-4 text-[#A1A1AA] truncate">{song.artist}</div>
                        <div className="col-span-2 text-right text-[#A1A1AA]">{song.likes.toLocaleString()}</div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div className="text-center py-10 text-[#A1A1AA]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      Tidak ada lagu ditemukan {searchInput ? `untuk "${searchInput}"` : ''}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </main>

        {/* Right Sidebar - Song Details */}
        <aside className="w-80 p-8 overflow-y-auto bg-gradient-to-b from-[#23262F] to-[#181A20] border-l border-[#23262F] hidden md:block">
          <AnimatePresence>
            {currentSong ? (
              <motion.div
                key={currentSong.uuid}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col"
              >
                <div className="w-full h-64 bg-[#23262F] rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                  <img
                    src={getThumbnailUrl(currentSong.thumbnail)}
                    alt={`${currentSong.title} thumbnail`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-[#F3F4F6]">{currentSong.title}</h2>
                <p className="text-[#A1A1AA] mb-4">{currentSong.artist}</p>
                <p className="text-sm text-[#F3F4F6] mb-6">{currentSong.description}</p>
                <div className="mb-6">
                  <h3 className="font-bold mb-2 text-[#7EE787]">Likes</h3>
                  <p className="text-[#A1A1AA]">{currentSong.likes.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2 text-[#7EE787]">Comments</h3>
                  {currentSong.comments.length > 0 ? (
                    <div className="space-y-3">
                      {currentSong.comments.map((comment, index) => (
                        <div key={index} className="bg-[#23262F] p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm text-[#F3F4F6]">{comment.creator}</span>
                            <span className="text-xs text-[#A1A1AA]">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#F3F4F6]">{comment.comment_text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#A1A1AA] text-sm">Belum ada komentar</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div className="text-[#A1A1AA] text-center mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Pilih lagu untuk melihat detail
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
        </div>
        {/* Player Controls */}
        <footer className="h-16 bg-[#1F222A] border-t border-[#23262F] flex items-center justify-center text-[#A1A1AA] text-sm tracking-wide">
          <span>© {new Date().getFullYear()} Your Music App</span>
        </footer>
      </div>
      {/* Overlay detail lagu */}
      <AnimatePresence>
        {selectedSong && (
          <SongDetailContent
            song={selectedSong}
            onClose={() => setSelectedSong(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PlaylistPage;