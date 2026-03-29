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

    private ensurePlayer(source?: { uri: string }) {
        this.ensureClient();

        if (!this.player) {
            if (!source) {
                throw new Error('Cannot create audio player without a source.');
            }

            this.player = createAudioPlayer(source);
            return;
        }

        if (source) {
            this.player.replace(source);
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

        const source = { uri };

        if (!this.player) {
            this.ensurePlayer(source);
        } else {
            this.player.replace(source);
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