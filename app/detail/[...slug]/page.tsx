import SongDetailClient from "../SongDetailClient";

export const dynamic = "force-dynamic";

export default function Page({ params }: { params: { slug: string[] } }) {
  return <SongDetailClient slug={params.slug} />;
}

