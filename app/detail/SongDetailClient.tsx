"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import SongDetailContent from "./SongDetailContent";

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

interface SongDetailClientProps {
  slug: string[];
}

export default function SongDetailClient({ slug }: SongDetailClientProps) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !slug[0]) return;
    setLoading(true);
    setError(null);
    axios.get(`https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song/${slug[0]}`)
      .then(res => {
        if (res.data.success) setSong(res.data.data);
        else setError(res.data.message);
      })
      .catch(() => setError("Gagal mengambil data lagu"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen bg-black text-red-500">{error}</div>;
  if (!song) return <div className="flex justify-center items-center h-screen bg-black text-white">No song found</div>;

  return <SongDetailContent song={song} />;
}
