import { notFound } from "next/navigation";
import SongDetailContent from "../SongDetailContent";
import axios from "axios";

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

export default async function DetailPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug?.[0];
  if (!slug) return notFound();

  let song: Song | null = null;
  try {
    const res = await axios.get(`https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song/${slug}`);
    if (res.data.success) song = res.data.data;
  } catch {
    // song will remain null
  }

  if (!song) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Song not found</h1>
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-black py-10 px-4">
      <div className="bg-[#181A20] rounded-xl shadow-xl max-w-2xl w-full p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img src={song.thumbnail} alt={song.title} className="w-48 h-48 object-cover rounded-lg shadow-md" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-[#F3F4F6]">{song.title}</h1>
            <p className="text-xl text-[#A1A1AA] mb-2">{song.artist}</p>
            <p className="text-[#F3F4F6] mb-4">{song.description}</p>
            <audio controls className="w-full mt-2">
              <source src={song.source} />
              Your browser does not support the audio element.
            </audio>
            <div className="mt-4">
              <span className="text-[#7EE787] font-semibold">Likes: </span>
              <span className="text-[#F3F4F6]">{song.likes.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#181A20] rounded-xl shadow-xl max-w-2xl w-full p-8">
        <h2 className="text-lg font-bold mb-4 text-[#7EE787]">Comments ({song.comments.length})</h2>
        {song.comments.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
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
          <p className="text-[#A1A1AA] text-sm">No comments yet</p>
        )}
      </div>
    </div>
  );
}
