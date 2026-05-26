export const routes = {
    album: (id: string) =>
    ({
        pathname: '/album/[id]' as const,
        params: { id },
    }),
    artist: (id: string) =>
    ({
        pathname: '/artist/[id]' as const,
        params: { id },
    }),
    playlist: (id: string) =>
    ({
        pathname: '/playlist/[id]' as const,
        params: { id },
    }),
    nowPlaying: () => '/now-playing' as const,
};