/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { ArtistMetadata } from '../pages/ChooseArtist';

export type PlaylistMetadata = {
    embedURL?: string | URL;
    unmappedSongs?: string[];
};

export type SetlistMetadata = {
    songs?: string[];
};

export type ListenerContextType = {
    chosenArtist: ArtistMetadata | null;
    setChosenArtist: React.Dispatch<React.SetStateAction<ArtistMetadata | null>>;
    token: string;
    playlistMetadata: PlaylistMetadata | null;
    setPlaylistMetadata: React.Dispatch<React.SetStateAction<PlaylistMetadata | null>>;
    setlistMetadata: SetlistMetadata | null;
    setSetlistMetadata: React.Dispatch<React.SetStateAction<SetlistMetadata | null>>;
    setlistLoaded: boolean;
    setSetlistLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ListenerContext = React.createContext<ListenerContextType | undefined>(undefined);

export function useListenerContext() {
    const ctx = React.useContext(ListenerContext);
    if (!ctx) throw new Error('useListenerContext must be used within ListenerContext.Provider');
    return ctx;
}

export default ListenerContext;
