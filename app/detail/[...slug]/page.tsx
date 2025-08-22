import SongDetailClient from "../SongDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string[];
  };
}

export default function Page({ params }: PageProps) {
  return <SongDetailClient slug={params.slug} />;
}
