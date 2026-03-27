import { TrackDto } from '@/domain/dto/track.dto';
import { Track } from '@/domain/models/track.model';
import { formatDuration } from '@/utils/formatDuration';

export function mapTrackDto(dto: TrackDto): Track {
    return {
        id: dto.id,
        sourceId: dto.sourceId,
        sourceKind: dto.sourceKind,
        title: dto.title,
        artistName: dto.artistName,
        albumTitle: dto.albumTitle,
        subtitle: `${dto.artistName} • ${dto.albumTitle}`,
        durationSeconds: dto.durationSeconds,
        durationLabel: formatDuration(dto.durationSeconds),
        coverUrl: dto.coverUrl,
        isOfflineAvailable: dto.isOfflineAvailable,
    };
}