import { WebdavConnection } from '@/stores/offline.store';
import { theme } from '@/theme';
import { HardDriveDownload, ServerOff } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

type Props = {
    connection: WebdavConnection;
    onConnect?: () => void;
    onManage?: () => void;
};

const cardStyle = {
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
} as const;

const iconCircleStyle = {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.surfaceAlt,
};

export function WebDavConnectionCard({ connection, onConnect, onManage }: Props) {
    if (connection.status === 'disconnected') {
        return (
            <View style={cardStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                    <View style={iconCircleStyle}>
                        <ServerOff size={22} color={theme.colors.textMuted} />
                    </View>
                    <View style={{ flex: 1, gap: theme.spacing.xs }}>
                        <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.cardTitle, fontWeight: '700' }}>
                            WebDAV
                        </Text>
                        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.body }}>
                            Aucun serveur connecté
                        </Text>
                    </View>
                </View>

                <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.body, lineHeight: 20 }}>
                    Connectez un serveur WebDAV (Nextcloud, Synology, NAS…) pour accéder à votre bibliothèque distante.
                </Text>

                <Pressable
                    onPress={onConnect}
                    style={{
                        paddingHorizontal: theme.spacing.lg,
                        paddingVertical: theme.spacing.md,
                        borderRadius: theme.radius.pill,
                        backgroundColor: theme.colors.accent,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: theme.colors.bg, fontWeight: '700', fontSize: theme.typography.body }}>
                        Connecter un serveur WebDAV
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={cardStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                <View style={iconCircleStyle}>
                    <HardDriveDownload size={22} color={theme.colors.accent} />
                </View>

                <View style={{ flex: 1, gap: theme.spacing.xs }}>
                    <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.cardTitle, fontWeight: '700' }}>
                        WebDAV
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.body }} numberOfLines={1}>
                        {connection.serverLabel}
                    </Text>
                </View>

                <View style={{
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    borderRadius: theme.radius.pill,
                    backgroundColor: theme.colors.accentSoft,
                }}>
                    <Text style={{ color: theme.colors.accent, fontSize: theme.typography.caption, fontWeight: '700' }}>
                        Connecté
                    </Text>
                </View>
            </View>

            <Pressable
                onPress={onManage}
                style={{
                    alignSelf: 'flex-start',
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.md,
                    borderRadius: theme.radius.pill,
                    backgroundColor: theme.colors.accentSoft,
                }}
            >
                <Text style={{ color: theme.colors.accent, fontWeight: '700' }}>
                    Gérer la connexion
                </Text>
            </Pressable>
        </View>
    );
}
