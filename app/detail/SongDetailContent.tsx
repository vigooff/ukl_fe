"use client";


import React from "react";

interface SongDetailContentProps {
  song: {
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
  } | null;
  onClose: () => void;
}

export default function SongDetailContent({ song, onClose }: SongDetailContentProps) {
  if (!song) return null;

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#181A20] rounded-xl shadow-xl max-w-2xl w-full p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A1A1AA] hover:text-[#7EE787] text-2xl font-bold"
          title="Tutup"
        >
          ×
        </button>
        <div className="mb-6 aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden">
          <iframe
            src={getYouTubeEmbedUrl(song.source)}
            className="w-full h-64 rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={song.title}
          ></iframe>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-[#F3F4F6]">{song.title}</h1>
        <p className="text-xl text-[#A1A1AA] mb-4">{song.artist}</p>
        <p className="text-[#F3F4F6] mb-4">{song.description}</p>
        <div className="mb-4">
          <span className="text-[#7EE787] font-semibold">Likes: </span>
          <span className="text-[#F3F4F6]">{song.likes.toLocaleString()}</span>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2 text-[#7EE787]">Comments ({song.comments.length})</h2>
          {song.comments.length > 0 ? (
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
              {song.comments.map((comment, idx) => (
                <div key={idx} className="bg-[#23262F] p-3 rounded-lg">
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
      </div>
    </div>
  );
}
