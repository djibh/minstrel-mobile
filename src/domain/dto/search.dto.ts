import { AlbumDto } from '@/domain/dto/album.dto';
import { ArtistDto } from '@/domain/dto/artist.dto';
import { PlaylistDto } from '@/domain/dto/playlist.dto';
import { TrackDto } from '@/domain/dto/track.dto';

export type SearchResultsDto = {
    query: string;
    tracks: TrackDto[];
    albums: AlbumDto[];
    artists: ArtistDto[];
    playlists: PlaylistDto[];
};