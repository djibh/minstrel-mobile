import { AlbumCover } from '@/components/media/AlbumCover';
import { PendingImportAsset } from '@/stores/offline.store';
import { theme } from '@/theme';
import { formatBytes } from '@/utils/formatBytes';
import { X } from 'lucide-react-native';
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

type Props = {
    assets: PendingImportAsset[];
    onConfirm: () => void;
    onCancel: () => void;
    onRemove: (id: string) => void;
};

export function ImportConfirmSheet({ assets, onConfirm, onCancel, onRemove }: Props) {
    const visible = assets.length > 0;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onCancel}
        >
            <Pressable
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
                onPress={onCancel}
            >
                <Pressable onPress={() => undefined}>
                    <View
                        style={{
                            backgroundColor: theme.colors.bgElevated,
                            borderTopLeftRadius: theme.radius.xl,
                            borderTopRightRadius: theme.radius.xl,
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderColor: theme.colors.border,
                            paddingTop: theme.spacing.lg,
                            paddingBottom: theme.spacing.xxxl,
                            maxHeight: '80%',
                        }}
                    >
                        {/* Header */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: theme.spacing.lg,
                                marginBottom: theme.spacing.md,
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        color: theme.colors.textPrimary,
                                        fontWeight: '700',
                                        fontSize: 17,
                                    }}
                                >
                                    Confirmer l'import
                                </Text>
                                <Text
                                    style={{
                                        color: theme.colors.textSecondary,
                                        fontSize: theme.typography.caption,
                                        marginTop: 2,
                                    }}
                                >
                                    {assets.length} fichier{assets.length > 1 ? 's' : ''} sélectionné{assets.length > 1 ? 's' : ''}
                                </Text>
                            </View>

                            <Pressable
                                onPress={onCancel}
                                hitSlop={12}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: theme.colors.surfaceAlt,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <X size={16} color={theme.colors.textSecondary} />
                            </Pressable>
                        </View>

                        {/* Separator */}
                        <View
                            style={{
                                height: 1,
                                backgroundColor: theme.colors.border,
                                marginHorizontal: theme.spacing.lg,
                                marginBottom: theme.spacing.sm,
                            }}
                        />

                        {/* File list */}
                        <ScrollView
                            style={{ flexGrow: 0 }}
                            contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
                        >
                            {assets.map((asset, index) => (
                                <View key={asset.id}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: theme.spacing.md,
                                            paddingVertical: theme.spacing.md,
                                        }}
                                    >
                                        <AlbumCover size={44} radius={theme.radius.md} coverUrl={asset.coverUrl} />

                                        <View style={{ flex: 1, gap: 2 }}>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    color: theme.colors.textPrimary,
                                                    fontWeight: '600',
                                                    fontSize: theme.typography.rowTitle,
                                                }}
                                            >
                                                {asset.title}
                                            </Text>
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    color: theme.colors.textSecondary,
                                                    fontSize: theme.typography.caption,
                                                }}
                                            >
                                                {asset.artistName} · {asset.albumTitle}
                                            </Text>
                                            {asset.size ? (
                                                <Text
                                                    style={{
                                                        color: theme.colors.textMuted,
                                                        fontSize: 11,
                                                    }}
                                                >
                                                    {formatBytes(asset.size)}
                                                </Text>
                                            ) : null}
                                        </View>

                                        <Pressable
                                            onPress={() => onRemove(asset.id)}
                                            hitSlop={10}
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 14,
                                                backgroundColor: theme.colors.surfaceAlt,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <X size={13} color={theme.colors.textMuted} />
                                        </Pressable>
                                    </View>

                                    {index < assets.length - 1 ? (
                                        <View
                                            style={{
                                                height: 1,
                                                backgroundColor: theme.colors.border,
                                                opacity: 0.35,
                                            }}
                                        />
                                    ) : null}
                                </View>
                            ))}
                        </ScrollView>

                        {/* Footer actions */}
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: theme.spacing.md,
                                paddingHorizontal: theme.spacing.lg,
                                paddingTop: theme.spacing.lg,
                            }}
                        >
                            <Pressable
                                onPress={onCancel}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: theme.radius.lg,
                                    backgroundColor: theme.colors.surfaceAlt,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.textSecondary,
                                        fontWeight: '600',
                                        fontSize: theme.typography.body,
                                    }}
                                >
                                    Annuler
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={onConfirm}
                                style={{
                                    flex: 2,
                                    paddingVertical: 14,
                                    borderRadius: theme.radius.lg,
                                    backgroundColor: theme.colors.accent,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.bg,
                                        fontWeight: '700',
                                        fontSize: theme.typography.body,
                                    }}
                                >
                                    Importer ({assets.length})
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
