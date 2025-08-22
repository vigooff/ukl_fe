"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

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
    <div className="bg-black text-white font-sans h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Playlists */}
        <div className="w-64 bg-black p-4 overflow-y-auto border-r border-gray-800">
          <h2 className="text-xl font-bold mb-6">Your Library</h2>
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.uuid}
                className={`p-2 rounded-md cursor-pointer hover:bg-gray-800 ${selectedPlaylist === playlist.uuid ? 'bg-gray-800' : ''}`}
                onClick={() => handlePlaylistClick(playlist.uuid)}
              >
                <h3 className="font-medium">{playlist.playlist_name}</h3>
                <p className="text-sm text-gray-400">{playlist.song_count} songs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Content - Songs */}
        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                  {playlists.find(p => p.uuid === selectedPlaylist)?.playlist_name || 'Playlist'}
                </h1>
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={tempSearchInput}
                    onChange={(e) => setTempSearchInput(e.target.value)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-r-md flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </form>
              </div>
              
              <div className="mb-8">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 border-b border-gray-800">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">TITLE</div>
                  <div className="col-span-4">ARTIST</div>
                  <div className="col-span-2 text-right">LIKES</div>
                </div>
                
                {filteredSongs.length > 0 ? (
                  filteredSongs.map((song, index) => (
                    <div 
                      key={song.uuid}
                      className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-md hover:bg-gray-800 ${currentSong?.uuid === song.uuid ? 'bg-gray-800' : ''}`}
                      onClick={() => router.push(`/detail?song_id=${song.uuid}`)}
                    >
                      <div className="col-span-1 text-gray-400">{index + 1}</div>
                      <div className="col-span-5 font-medium flex items-center">
                        <img 
                          src={getThumbnailUrl(song.thumbnail)} 
                          alt={`${song.title} thumbnail`} 
                          className="w-10 h-10 rounded-md mr-3 object-cover"
                          onError={handleImageError}
                          loading="lazy"
                        />
                        {song.title}
                      </div>
                      <div className="col-span-4 text-gray-400">{song.artist}</div>
                      <div className="col-span-2 text-right text-gray-400">
                        {song.likes.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    No songs found {searchInput ? `for "${searchInput}"` : ''}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Song Details */}
        <div className="w-72 p-6 overflow-y-auto bg-gradient-to-b from-gray-900 to-black border-l border-gray-800">
          {currentSong ? (
            <div className="flex flex-col">
              <div className="w-full h-64 bg-gray-700 rounded-md mb-6 overflow-hidden">
                <img 
                  src={getThumbnailUrl(currentSong.thumbnail)} 
                  alt={`${currentSong.title} thumbnail`} 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <h2 className="text-xl font-bold mb-2">{currentSong.title}</h2>
              <p className="text-gray-400 mb-4">{currentSong.artist}</p>
              <p className="text-sm text-gray-300 mb-6">{currentSong.description}</p>
              
              <div className="mb-6">
                <h3 className="font-bold mb-2">Likes</h3>
                <p className="text-gray-400">{currentSong.likes.toLocaleString()}</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Comments</h3>
                {currentSong.comments.length > 0 ? (
                  <div className="space-y-3">
                    {currentSong.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-800 p-3 rounded-md">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{comment.creator}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{comment.comment_text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No comments yet</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-10">
              Select a song to view details
            </div>
          )}
        </div>
      </div>

      {/* Player Controls */}
      <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center px-4">
        {currentSong && (
          <>
            <div className="w-1/4 flex items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-md mr-3 overflow-hidden">
                <img 
                  src={getThumbnailUrl(currentSong.thumbnail)} 
                  alt={`${currentSong.title} thumbnail`} 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <div>
                <h4 className="font-medium text-sm">{currentSong.title}</h4>
                <p className="text-gray-400 text-xs">{currentSong.artist}</p>
              </div>
            </div>
            
            <div className="w-2/4 flex flex-col items-center">
              <div className="flex items-center space-x-4 mb-2">
                <button className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                  </svg>
                </button>
                <button className="bg-white rounded-full p-2 hover:scale-105 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
                  </svg>
                </button>
              </div>
              
              <div className="w-full flex items-center space-x-2">
                <span className="text-xs text-gray-400">0:00</span>
                <div className="flex-1 h-1 bg-gray-700 rounded-full">
                  <div className="h-1 bg-gray-400 rounded-full w-1/4"></div>
                </div>
                <span className="text-xs text-gray-400">3:30</span>
              </div>
            </div>
            
            <div className="w-1/4 flex justify-end items-center space-x-3">
              <button className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="w-24 h-1 bg-gray-700 rounded-full">
                <div className="h-1 bg-gray-400 rounded-full w-3/4"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;