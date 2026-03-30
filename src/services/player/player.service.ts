import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

type AudioPlayerInstance = ReturnType<typeof createAudioPlayer>;

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
        this.player?.seekTo(seconds);
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
        return this.player?.currentTime ?? 0;
    }

    getDuration() {
        return this.player?.duration ?? 0;
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