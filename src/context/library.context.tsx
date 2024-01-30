'use client';
import { createContext } from 'react';
import { useLocalStorageState } from '@/hooks';
import { AlbumType, ArtistType, PlaylistType, TrackType } from '@/services/spotify';
import { LibraryItemProps } from '@/components/LibraryItem/LibraryItem';

type ItemType = AlbumType | PlaylistType | ArtistType;

interface Context {
  liked: string[];
  libraryItems: LibraryItemProps['data'][];

  /** Save track to 'Liked Songs'. If track is already saved, It'll be removed. */
  onSaveToLiked: (trackId: string) => void;

  /** Save an Album or a Playlist to Your Library. If it's already saved, It'll be removed. */
  onSaveToLibrary: (item: ItemType) => void;

  onRemoveFromYourLibrary: (id: string) => void;
  libraryHas: (item: ItemType | TrackType) => boolean;
}

const initial: Context = {
  liked: [],
  libraryItems: [],
  onSaveToLiked: () => {},
  onSaveToLibrary: () => {},
  onRemoveFromYourLibrary: () => {},
  libraryHas: () => false,
};

export const LibraryContext = createContext(initial);

export function LibraryContextProvider({ children }: { children: React.ReactNode }) {
  const [liked, setLiked] = useLocalStorageState('liked-songs', initial.liked);
  const [libraryItems, setLibraryItems] = useLocalStorageState(
    'library-items',
    initial.libraryItems
  );

  const onSaveToLibrary: Context['onSaveToLibrary'] = (item) => {
    setLibraryItems((state) => {
      const copy = state.slice();

      const existsAt = copy.findIndex((loopItem) => loopItem.id === item.id);

      if (existsAt !== -1) {
        copy.splice(existsAt, 1);
      } else {
        let newLibraryItem: LibraryItemProps['data'] = {
          id: item.id,
          title: item.name,
          type: item.type,
          image:
            item.images.length === 0 ? null : (item.images[1] || item.images[0]).url,
        };

        const trackLength =
          item.type !== 'artist' &&
          ((item as AlbumType).total_tracks ||
            (item as AlbumType | PlaylistType).tracks?.total);

        if (trackLength) {
          newLibraryItem.trackLength = trackLength;
        }

        copy.push(newLibraryItem);
      }

      return copy;
    });
  };

  const onRemoveFromYourLibrary: Context['onRemoveFromYourLibrary'] = (
    id: string
  ) => {
    setLibraryItems((state) => {
      const index = state.findIndex((item) => item.id === id);

      return [...state.slice(0, index), ...state.slice(index + 1)];
    });
  };

  const onSaveToLiked: Context['onSaveToLiked'] = (trackId) => {
    setLiked((state) => {
      const index = state.indexOf(trackId);

      if (index === -1) {
        return [...state, trackId];
      }

      return [...state.slice(0, index), ...state.slice(index + 1)];
    });
  };

  const libraryHas: Context['libraryHas'] = (argItem) => {
    if (argItem.type === 'track') {
      return liked.includes(argItem.id);
    }

    return libraryItems.some((item) => item.id === argItem.id);
  };

  return (
    <LibraryContext.Provider
      value={{
        liked,
        libraryItems,
        onSaveToLiked,
        onSaveToLibrary,
        onRemoveFromYourLibrary,
        libraryHas,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
