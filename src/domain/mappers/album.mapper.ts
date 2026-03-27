import { AlbumDto } from '@/domain/dto/album.dto';
import { Album } from '@/domain/models/album.model';

export function mapAlbumDto(dto: AlbumDto): Album {
    return {
        id: dto.id,
        sourceId: dto.sourceId,
        sourceKind: dto.sourceKind,
        title: dto.title,
        artistName: dto.artistName,
        year: dto.year,
        trackCount: dto.trackCount,
        coverUrl: dto.coverUrl,
        isOfflineAvailable: dto.isOfflineAvailable,
    };
}