import { ArtistDto } from '@/domain/dto/artist.dto';
import { Artist } from '@/domain/models/artist.model';

export function mapArtistDto(dto: ArtistDto): Artist {
    return {
        id: dto.id,
        sourceId: dto.sourceId,
        sourceKind: dto.sourceKind,
        name: dto.name,
        imageUrl: dto.imageUrl,
        albumCount: dto.albumCount,
        trackCount: dto.trackCount,
        subtitle: `${dto.albumCount} albums • ${dto.trackCount} morceaux`,
    };
}