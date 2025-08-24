"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

type Props = {
  song: Song;
  /** opsional: jika diberikan -> tampil sebagai overlay modal, jika tidak -> tampil sebagai konten halaman biasa */
  onClose?: () => void;
};

export default function SongDetailContent({ song, onClose }: Props) {
  const isOverlay = typeof onClose === "function";

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    isOverlay ? (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    ) : (
      <div className="min-h-screen bg-black py-10 px-4 flex items-start justify-center">
        {children}
      </div>
    );

  // Helper to extract YouTube video ID from a URL
  function getYouTubeVideoId(url: string): string | null {
    const regExp = /(?:youtube[.-]com\/(?:.*v=|v\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  const youtubeId = getYouTubeVideoId(song.source);
  const youtubeUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : null;

  return (
    <Wrapper>
      <motion.div
        className="bg-[#181A20] rounded-xl shadow-xl w-full max-w-3xl p-6 md:p-8 relative"
        initial={isOverlay ? { scale: 0.95, opacity: 0 } : { opacity: 0, y: 12 }}
        animate={isOverlay ? { scale: 1, opacity: 1 } : { opacity: 1, y: 0 }}
        exit={isOverlay ? { scale: 0.95, opacity: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.2 }}
      >
        {isOverlay && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#A1A1AA] hover:text-[#F3F4F6] text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        <div className="flex flex-col md:flex-row gap-6 items-center">
          {youtubeUrl ? (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open YouTube video in new tab"
              className="group"
            >
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-48 h-48 object-cover rounded-lg shadow-md border border-[#23262F] transition-transform group-hover:scale-105 cursor-pointer"
              />
            </a>
          ) : (
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-48 h-48 object-cover rounded-lg shadow-md border border-[#23262F]"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#F3F4F6]">
              {song.title}
            </h1>
            <p className="text-lg text-[#A1A1AA] mb-3">{song.artist}</p>
            <p className="text-sm md:text-base text-[#F3F4F6] mb-4">
              {song.description}
            </p>

            {/* Jika source adalah YouTube, tetap bisa diputar sebagai link/iframe di versi kamu nanti.
                Untuk sekarang, pakai audio/html bila source adalah audio langsung */}
            <audio controls className="w-full">
              <source src={song.source} />
              Your browser does not support the audio element.
            </audio>

            <div className="mt-4">
              <span className="text-[#7EE787] font-semibold">Likes: </span>
              <span className="text-[#F3F4F6]">{song.likes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-[#7EE787]">
            Comments ({song.comments.length})
          </h2>
          {song.comments.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {song.comments.map((c, i) => (
                <div key={i} className="bg-[#23262F] p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-[#F3F4F6]">
                      {c.creator}
                    </span>
                    <span className="text-xs text-[#A1A1AA]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#F3F4F6]">{c.comment_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#A1A1AA] text-sm">No comments yet</p>
          )}
        </div>
      </motion.div>
    </Wrapper>
  );
}
