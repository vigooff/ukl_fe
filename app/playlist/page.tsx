
import { Suspense } from "react";
import dynamic from "next/dynamic";

const PlaylistClient = dynamic(() => import("./PlaylistClient"));

export default function PlaylistPage() {
  return (
    <Suspense fallback={<div className="text-white flex justify-center items-center h-screen">Loading...</div>}>
      <PlaylistClient />
    </Suspense>
  );
}
