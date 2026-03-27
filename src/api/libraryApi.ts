import { AlbumDto } from '@/domain/dto/album.dto';
import { ArtistDto } from '@/domain/dto/artist.dto';
import { PlaylistDto } from '@/domain/dto/playlist.dto';
import { TrackDto } from '@/domain/dto/track.dto';
import { apiGet } from './client';

export const libraryApi = {
    getAlbums: (source = 'all', sort = 'alpha') =>
        apiGet<AlbumDto[]>(`/library/albums?source=${source}&sort=${sort}`),

    getArtists: (source = 'all', sort = 'alpha') =>
        apiGet<ArtistDto[]>(`/library/artists?source=${source}&sort=${sort}`),

    getTracks: (source = 'all', sort = 'alpha') =>
        apiGet<TrackDto[]>(`/library/tracks?source=${source}&sort=${sort}`),

    getPlaylists: (source = 'all', sort = 'alpha') =>
        apiGet<PlaylistDto[]>(`/library/playlists?source=${source}&sort=${sort}`),
};