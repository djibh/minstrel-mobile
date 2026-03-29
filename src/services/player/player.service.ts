import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

class MinstrelPlayerService {
    private player = createAudioPlayer(null as any);
    private isConfigured = false;

    async configure() {
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
        this.player.replace({ uri });
    }

    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }

    seekTo(seconds: number) {
        this.player.seekTo(seconds);
    }

    getCurrentTime() {
        return this.player.currentTime ?? 0;
    }

    getDuration() {
        return this.player.duration ?? 0;
    }

    isPlaying() {
        return this.player.playing ?? false;
    }

    getInstance() {
        return this.player;
    }

    release() {
        this.player.release();
    }
}

export const minstrelPlayerService = new MinstrelPlayerService();