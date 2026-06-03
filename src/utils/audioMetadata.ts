import { Directory, File, Paths } from 'expo-file-system';

const METADATA_READ_SIZE = 1024 * 1024;

export type AudioMetadata = {
    title?: string;
    artist?: string;
    album?: string;
    coverUrl: string | null;
};

function readSynchsafeInt(b: Uint8Array, offset: number): number {
    return (
        ((b[offset] & 0x7f) << 21) |
        ((b[offset + 1] & 0x7f) << 14) |
        ((b[offset + 2] & 0x7f) << 7) |
        (b[offset + 3] & 0x7f)
    );
}

function readInt32(b: Uint8Array, offset: number): number {
    return (b[offset] << 24) | (b[offset + 1] << 16) | (b[offset + 2] << 8) | b[offset + 3];
}

function decodeText(bytes: Uint8Array, encoding: number): string {
    try {
        if (encoding === 0) {
            return Array.from(bytes).map((c) => String.fromCharCode(c)).join('');
        }
        if (encoding === 3) {
            return new TextDecoder('utf-8').decode(bytes);
        }
        if (encoding === 1) {
            // UTF-16 with BOM — skip BOM if present
            const hasBom = bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe;
            return new TextDecoder('utf-16le').decode(hasBom ? bytes.slice(2) : bytes);
        }
        // encoding 2 (UTF-16BE) — manual decode, Hermes doesn't support it
        let result = '';
        for (let i = 0; i + 1 < bytes.length; i += 2) {
            const code = (bytes[i] << 8) | bytes[i + 1];
            if (code === 0) break;
            result += String.fromCharCode(code);
        }
        return result;
    } catch {
        return '';
    }
}

// Returns the index just past the null terminator for the given encoding.
function skipNullTerminator(b: Uint8Array, offset: number, encoding: number): number {
    if (encoding === 1 || encoding === 2) {
        while (offset + 1 < b.length) {
            if (b[offset] === 0 && b[offset + 1] === 0) return offset + 2;
            offset += 2;
        }
        return b.length;
    }
    while (offset < b.length && b[offset] !== 0) offset++;
    return offset + 1;
}

interface ID3Tags {
    title?: string;
    artist?: string;
    album?: string;
    picture?: { data: Uint8Array; format: string };
}

function parseID3v2(bytes: Uint8Array): ID3Tags {
    const result: ID3Tags = {};

    if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return result;

    const majorVersion = bytes[3];
    if (majorVersion < 3 || majorVersion > 4) return result;

    const flags = bytes[5];
    const hasExtHeader = (flags & 0x40) !== 0;
    const tagSize = readSynchsafeInt(bytes, 6);

    let pos = 10;
    if (hasExtHeader) {
        const extSize = majorVersion === 4
            ? readSynchsafeInt(bytes, pos)
            : readInt32(bytes, pos);
        pos += extSize;
    }

    const tagEnd = Math.min(10 + tagSize, bytes.length);

    while (pos + 10 <= tagEnd) {
        const frameId = String.fromCharCode(bytes[pos], bytes[pos + 1], bytes[pos + 2], bytes[pos + 3]);
        if (bytes[pos] === 0) break;

        const frameSize = majorVersion === 4
            ? readSynchsafeInt(bytes, pos + 4)
            : readInt32(bytes, pos + 4);

        pos += 10;
        if (frameSize <= 0 || pos + frameSize > tagEnd) break;

        const frame = bytes.subarray(pos, pos + frameSize);

        if (frameId === 'TIT2' || frameId === 'TPE1' || frameId === 'TALB') {
            const text = decodeText(frame.subarray(1), frame[0]).replace(/\0/g, '').trim();
            if (frameId === 'TIT2') result.title = text || undefined;
            else if (frameId === 'TPE1') result.artist = text || undefined;
            else if (frameId === 'TALB') result.album = text || undefined;
        } else if (frameId === 'APIC' && !result.picture) {
            const encoding = frame[0];
            let i = 1;
            // MIME type — ASCII, single-null terminated
            const mimeEnd = skipNullTerminator(frame, i, 0) - 1;
            const mimeType = new TextDecoder('ascii').decode(frame.subarray(i, mimeEnd));
            i = mimeEnd + 1;
            i++; // skip picture type byte
            // Description — encoding-dependent null
            i = skipNullTerminator(frame, i, encoding);
            result.picture = { data: frame.subarray(i), format: mimeType };
        }

        pos += frameSize;
    }

    return result;
}

export async function readAudioMetadata(fileUri: string, trackId: string): Promise<AudioMetadata> {
    try {
        const handle = new File(fileUri).open();
        const bytes = handle.readBytes(METADATA_READ_SIZE);
        handle.close();

        const tags = parseID3v2(bytes as unknown as Uint8Array);

        let coverUrl: string | null = null;
        if (tags.picture) {
            coverUrl = saveCoverArt(tags.picture.data, tags.picture.format, trackId);
        }

        return { title: tags.title, artist: tags.artist, album: tags.album, coverUrl };
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
