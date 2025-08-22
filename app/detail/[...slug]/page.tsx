import { notFound } from "next/navigation";
import axios from "axios";
import SongDetailContent from "../SongDetailContent";

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

export const dynamic = "force-dynamic";

// ✅ langsung typing di function params
export default async function Page({
  params,
}: {
  params: { slug: string[] };
}) {
  const slug = params.slug?.[0];
  if (!slug) return notFound();

  let song: Song | null = null;

  try {
    const res = await axios.get(
      `https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song/${slug}`
    );
    if (res.data.success) {
      song = res.data.data;
    }
  } catch (error) {
    // biarkan song tetap null kalau gagal fetch
  }

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-2xl font-bold mb-4">Song not found</h1>
      </div>
    );
  }

  // ✅ kirim song ke SongDetailContent
  return <SongDetailContent song={song} />;
}
