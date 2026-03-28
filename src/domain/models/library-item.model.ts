import { Album } from '@/domain/models/album.model';
import { Artist } from '@/domain/models/artist.model';
import { Playlist } from '@/domain/models/playlist.model';
import { Track } from '@/domain/models/track.model';

export type LibraryItem = Album | Artist | Track | Playlist;