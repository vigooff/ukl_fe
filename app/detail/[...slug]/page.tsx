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

type PageProps = {
  params: { slug: string[] };
};

export default async function DetailPage({ params }: PageProps) {
  const slug = params?.slug?.[0];
  if (!slug) return notFound();

  let song: Song | null = null;

  try {
    const res = await axios.get(
      `https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song/${slug}`
    );
    if (res.data?.success) {
      song = res.data.data as Song;
    }
  } catch {
    // kalau error biarkan song tetap null
  }

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-2xl font-bold mb-4">Song not found</h1>
      </div>
    );
  }

  return <SongDetailContent song={song} />;
}
