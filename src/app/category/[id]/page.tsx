import { cookies } from 'next/headers';
import {
  fetchCategoryPlaylists,
  fetchSingleBrowseCategory,
} from '@/services/spotify';
import Link from 'next/link';
import Card from '@/components/Card';
import Header from '@/components/Header';
import ItemPlayer from '@/components/ItemPlayer';
import ItemsGrid from '@/components/ItemsGrid';

interface Props {
  params: {
    id: string;
  };
}

export default async function CategoryPage({ params }: Props) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const categoryData = accessToken
    ? await fetchSingleBrowseCategory(params.id, accessToken)
    : null;
  const playlistsData = accessToken
    ? await fetchCategoryPlaylists(params.id, accessToken)
    : null;

  return (
    <>
      <Header />
      <main>
        {categoryData && (
          <div>
            <h1>{categoryData?.name}</h1>
          </div>
        )}
        <ItemsGrid>
          {playlistsData?.items.map((playlist) => (
            <ItemPlayer key={playlist.id} customPos={{ bottom: 114 }}>
              <Link href={`/playlist/${playlist.id}`}>
                <Card data={playlist} subtitle={playlist.description} subtitleMaxLines={2} />
              </Link>
            </ItemPlayer>
          ))}
        </ItemsGrid>
      </main>
    </>
  );
}
