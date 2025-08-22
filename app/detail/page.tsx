"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

interface SongDetail {
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

const SongDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const songId = searchParams.get('song_id');
  
  const [song, setSong] = useState<SongDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song/${songId}`);
        
        if (response.data.success) {
          setSong(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch song details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      fetchSongDetail();
    }
  }, [songId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-500">
        {error}
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        No song selected
      </div>
    );
  }

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button 
        onClick={() => router.back()}
        className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Playlist
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Video and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden">
            <iframe 
              src={getYouTubeEmbedUrl(song.source)} 
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={song.title}
            ></iframe>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-2">{song.title}</h1>
            <p className="text-xl text-gray-400 mb-4">{song.artist}</p>
            <p className="text-gray-300">{song.description}</p>
            
            <div className="mt-6 flex items-center">
              <span className="text-gray-400 mr-2">Likes:</span>
              <span className="text-white font-medium">{song.likes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Comments */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Comments ({song.comments.length})</h2>
            
            {song.comments.length > 0 ? (
              <div className="space-y-4">
                {song.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{comment.creator}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.comment_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailPage;