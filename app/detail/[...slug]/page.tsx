import SongDetailClient from "../SongDetailClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }: Promise<{ slug: string[] }>) {
  const { slug } = await params;
  return <SongDetailClient slug={slug} />;
}
