import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

type AudioPlayerInstance = ReturnType<typeof createAudioPlayer>;

function sanitizeTimeValue(value: number | null | undefined) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        return 0;
    }

    return value;
}

class MinstrelPlayerService {
    private player: AudioPlayerInstance | null = null;
    private isConfigured = false;

    private ensureClient() {
        if (typeof window === 'undefined') {
            throw new Error('Audio player is only available on the client.');
        }
    }

    async configure() {
        this.ensureClient();

        if (this.isConfigured) return;

        await setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            interruptionMode: 'doNotMix',
        });

        this.isConfigured = true;
    }

    async load(uri: string) {
        await this.configure();

        if (!this.player) {
            this.player = createAudioPlayer({ uri });
        } else {
            this.player.replace({ uri });
        }
    }

    play() {
        this.player?.play();
    }

    pause() {
        this.player?.pause();
    }

    seekTo(seconds: number) {
        this.player?.seekTo(sanitizeTimeValue(seconds));
    }

    setLoop(value: boolean) {
        if (this.player) {
            this.player.loop = value;
        }
    }

    setLockScreenMetadata(metadata: {
        title: string;
        artist: string;
        albumTitle?: string;
        artworkUrl?: string;
    }) {
        this.player?.setActiveForLockScreen(true, metadata);
    }

    clearLockScreenMetadata() {
        this.player?.setActiveForLockScreen(false);
    }

    getCurrentTime() {
        return sanitizeTimeValue(this.player?.currentTime);
    }

    getDuration() {
        return sanitizeTimeValue(this.player?.duration);
    }

    isPlaying() {
        return this.player?.playing ?? false;
    }

    getInstance() {
        return this.player;
    }

    release() {
        this.player?.release();
        this.player = null;
    }
}

export const minstrelPlayerService = new MinstrelPlayerService();
