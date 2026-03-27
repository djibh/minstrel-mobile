import { PlaylistDto } from '@/domain/dto/playlist.dto';
import { Playlist } from '@/domain/models/playlist.model';

export function mapPlaylistDto(dto: PlaylistDto): Playlist {
    return {
        id: dto.id,
        sourceId: dto.sourceId,
        sourceKind: dto.sourceKind,
        name: dto.name,
        coverUrl: dto.coverUrl,
        trackCount: dto.trackCount,
        isOfflineAvailable: dto.isOfflineAvailable,
        subtitle: `${dto.trackCount} morceaux`,
    };
}