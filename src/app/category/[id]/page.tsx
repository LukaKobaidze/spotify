import { cookies } from 'next/headers';
import {
  fetchCategoryPlaylists,
  fetchSingleBrowseCategory,
} from '@/services/spotify';
import Header from '@/components/Header';
import ItemsGrid from '@/components/ItemsGrid';
import PlayerCard from '@/components/PlayerCard';
import ConsoleLogToClient from '@/components/ConsoleLogToClient/ConsoleLogToClient';

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

        {playlistsData?.items.length ? (
          <ItemsGrid>
            {playlistsData?.items.map((playlist) => (
              <PlayerCard
                key={playlist.id}
                data={playlist}
                description={playlist.description}
              />
            ))}
          </ItemsGrid>
        ) : (
          <div>
            <p>Couldn&apos;t find any playlists in this category</p>
          </div>
        )}
      </main>
    </>
  );
}
