"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface Song {
  uuid: string;
  title: string;
  artist: string;
  thumbnail: string;
}

interface SongDetailContentProps {
  song: Song | null;
  onClose: () => void;
}

const SongDetailContent: React.FC<SongDetailContentProps> = ({ song, onClose }) => {
  return (
    <AnimatePresence>
      {song && (
        <motion.div
          key={song.uuid}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg w-[400px]">
            <img src={song.thumbnail} alt={song.title} className="w-full rounded-lg mb-4" />
            <h2 className="text-xl font-bold">{song.title}</h2>
            <p className="text-gray-600">{song.artist}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SongDetailContent;
