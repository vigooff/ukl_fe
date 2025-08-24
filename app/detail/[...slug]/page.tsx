import SongDetailClient from "../SongDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug?: string[];
  };
}

export default function Page({ params }: PageProps) {
  const slug = params?.slug ?? []; // fallback kalau slug undefined
  return <SongDetailClient slug={slug} />;
}
