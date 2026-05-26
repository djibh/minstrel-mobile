import { Directory, File, Paths } from 'expo-file-system';
import { parseBuffer } from 'music-metadata-browser';

// 1MB covers virtually all ID3v2 blocks including embedded artwork
const METADATA_READ_SIZE = 1024 * 1024;

export type AudioMetadata = {
    title?: string;
    artist?: string;
    album?: string;
    coverUrl: string | null;
};

export async function readAudioMetadata(fileUri: string, trackId: string): Promise<AudioMetadata> {
    try {
        const handle = new File(fileUri).open();
        const bytes = handle.readBytes(METADATA_READ_SIZE);
        handle.close();

        const metadata = await parseBuffer(bytes as unknown as Buffer, undefined, { duration: false });
        const { title, artist, album, picture } = metadata.common;

        let coverUrl: string | null = null;
        if (picture && picture.length > 0) {
            coverUrl = saveCoverArt(picture[0].data, picture[0].format, trackId);
        }

        return { title, artist, album, coverUrl };
    } catch {
        return { coverUrl: null };
    }
}

function saveCoverArt(data: Uint8Array, format: string, trackId: string): string | null {
    try {
        const ext = format.includes('png') ? 'png' : 'jpg';
        const coversDir = new Directory(Paths.document, 'covers');
        coversDir.create({ idempotent: true });
        const coverFile = new File(coversDir, `${trackId}.${ext}`);
        if (!coverFile.exists) {
            coverFile.write(data);
        }
        return coverFile.uri;
    } catch {
        return null;
    }
}
