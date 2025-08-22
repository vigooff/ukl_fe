import SongDetailContent from "../SongDetailContent";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string[];
  };
}

export default function Page({ params }: PageProps) {
  const slug = params.slug;
  return <SongDetailContent slug={slug} />;
}
