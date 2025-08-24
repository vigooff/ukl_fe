import SongDetailClient from "../SongDetailClient";

export const dynamic = "force-dynamic";

// Next.js 15 secara default menganggap params bisa async (Promise)
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params; // tunggu params
  return <SongDetailClient slug={slug} />;
}
