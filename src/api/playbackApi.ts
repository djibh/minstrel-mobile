export const playbackApi = {
    getStreamUrl: (trackId: string) =>
        `${process.env.EXPO_PUBLIC_API_URL}/playback/tracks/${trackId}/stream`,
};