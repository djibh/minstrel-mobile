import { theme } from '@/theme';
import { Eye, EyeOff, X } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

type Props = {
    visible: boolean;
    initialServerUrl?: string;
    initialUsername?: string;
    initialFolderPath?: string;
    onClose: () => void;
    onSave: (serverUrl: string, username: string, password: string, folderPath: string) => Promise<void>;
};

const Field = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    right,
}: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'url';
    right?: React.ReactNode;
}) => (
    <View style={{ gap: theme.spacing.xs }}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>{label}</Text>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.bgElevated,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 10,
        }}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={keyboardType}
                style={{
                    flex: 1,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.md,
                    color: theme.colors.textPrimary,
                    fontSize: 14,
                }}
            />
            {right}
        </View>
    </View>
);

export function WebDavConfigModal({
    visible,
    initialServerUrl = '',
    initialUsername = '',
    initialFolderPath = '/',
    onClose,
    onSave,
}: Props) {
    const [serverUrl, setServerUrl] = useState(initialServerUrl);
    const [username, setUsername] = useState(initialUsername);
    const [password, setPassword] = useState('');
    const [folderPath, setFolderPath] = useState(initialFolderPath);
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!serverUrl.trim()) { setError("L'URL du serveur est requise."); return; }
        if (!username.trim()) { setError("Le nom d'utilisateur est requis."); return; }
        if (!password) { setError('Le mot de passe est requis.'); return; }
        setError(null);
        setSaving(true);
        try {
            await onSave(serverUrl.trim(), username.trim(), password, folderPath.trim() || '/');
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erreur inconnue.');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        if (!saving) {
            setError(null);
            onClose();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, justifyContent: 'center', paddingHorizontal: theme.spacing.lg, backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
                <View style={{ backgroundColor: theme.colors.surface, borderRadius: 16, padding: theme.spacing.xxl, gap: theme.spacing.lg }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.textPrimary, fontSize: 18, fontWeight: '600' }}>
                            Connexion WebDAV
                        </Text>
                        <Pressable onPress={handleClose} hitSlop={12}>
                            <X size={20} color={theme.colors.textMuted} />
                        </Pressable>
                    </View>

                    <Field
                        label="URL du serveur"
                        value={serverUrl}
                        onChangeText={setServerUrl}
                        placeholder="https://monnas.local/dav"
                        keyboardType="url"
                    />
                    <Field
                        label="Nom d'utilisateur"
                        value={username}
                        onChangeText={setUsername}
                        placeholder="utilisateur"
                    />
                    <Field
                        label="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        secureTextEntry={!showPassword}
                        right={
                            <Pressable onPress={() => setShowPassword(v => !v)} style={{ paddingHorizontal: theme.spacing.md }} hitSlop={8}>
                                {showPassword
                                    ? <EyeOff size={18} color={theme.colors.textMuted} />
                                    : <Eye size={18} color={theme.colors.textMuted} />}
                            </Pressable>
                        }
                    />
                    <Field
                        label="Dossier de musique (chemin)"
                        value={folderPath}
                        onChangeText={setFolderPath}
                        placeholder="/Musique"
                    />

                    {error && <Text style={{ color: theme.colors.error, fontSize: 13 }}>{error}</Text>}

                    <View style={{ flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.xs }}>
                        <Pressable
                            onPress={handleClose}
                            style={{ flex: 1, paddingVertical: theme.spacing.md, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' }}
                        >
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 15, fontWeight: '500' }}>Annuler</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleSave}
                            disabled={saving}
                            style={{ flex: 1, paddingVertical: theme.spacing.md, borderRadius: 10, backgroundColor: saving ? theme.colors.accentSoft : theme.colors.accent, alignItems: 'center' }}
                        >
                            {saving
                                ? <ActivityIndicator size="small" color={theme.colors.bg} />
                                : <Text style={{ color: theme.colors.bg, fontSize: 15, fontWeight: '600' }}>Connexion</Text>}
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
