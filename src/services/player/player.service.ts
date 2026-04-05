import { createAudioPlayer, type AudioStatus, setAudioModeAsync } from 'expo-audio';
import { logPlayerDebug } from '@/utils/playerDebug';

type AudioPlayerInstance = ReturnType<typeof createAudioPlayer>;
type PlaybackStatusListener = (status: AudioStatus) => void;
type LockScreenMetadata = {
    title: string;
    artist: string;
    albumTitle?: string;
    artworkUrl?: string;
};
type LockScreenOptions = {
    showSeekForward?: boolean;
    showSeekBackward?: boolean;
};

function sanitizeTimeValue(value: number | null | undefined) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        return 0;
    }

    return value;
}

class MinstrelPlayerService {
    private player: AudioPlayerInstance | null = null;
    private isConfigured = false;
    private lockScreenMetadata: LockScreenMetadata | null = null;
    private readonly lockScreenOptions: LockScreenOptions = {
        showSeekBackward: true,
        showSeekForward: true,
    };

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
        logPlayerDebug('service:configured');
    }

    async load(uri: string) {
        await this.configure();

        if (!this.player) {
            this.player = createAudioPlayer(
                { uri },
                {
                    updateInterval: 250,
                    keepAudioSessionActive: true,
                }
            );
            logPlayerDebug('service:playerCreated', { uri });
        } else {
            this.player.clearLockScreenControls();
            this.player.replace({ uri });
            logPlayerDebug('service:sourceReplaced', { uri });
        }

        if (this.lockScreenMetadata) {
            this.player.setActiveForLockScreen(
                true,
                this.lockScreenMetadata,
                this.lockScreenOptions
            );
        }
    }

    play() {
        this.player?.play();
        logPlayerDebug('service:play');
    }

    pause() {
        this.player?.pause();
        logPlayerDebug('service:pause');
    }

    async seekTo(seconds: number) {
        await this.player?.seekTo(sanitizeTimeValue(seconds));
        logPlayerDebug('service:seekTo', { seconds: sanitizeTimeValue(seconds) });
    }

    setLoop(value: boolean) {
        if (this.player) {
            this.player.loop = value;
            logPlayerDebug('service:setLoop', { enabled: value });
        }
    }

    setLockScreenMetadata(metadata: LockScreenMetadata) {
        this.lockScreenMetadata = metadata;

        if (!this.player) {
            return;
        }

        this.player.setActiveForLockScreen(true, metadata, this.lockScreenOptions);
        this.player.updateLockScreenMetadata(metadata);
        logPlayerDebug('service:setLockScreenMetadata', {
            title: metadata.title,
            artist: metadata.artist,
        });
    }

    clearLockScreenMetadata() {
        this.lockScreenMetadata = null;
        this.player?.clearLockScreenControls();
        this.player?.setActiveForLockScreen(false);
        logPlayerDebug('service:clearLockScreenMetadata');
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

    addPlaybackStatusListener(listener: PlaybackStatusListener) {
        return this.player?.addListener('playbackStatusUpdate', listener) ?? null;
    }

    release() {
        this.clearLockScreenMetadata();
        this.player?.remove();
        this.player = null;
        this.isConfigured = false;
        logPlayerDebug('service:release');
    }
}

export const minstrelPlayerService = new MinstrelPlayerService();
