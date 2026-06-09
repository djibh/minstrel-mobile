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
    initialEmail?: string;
    initialFolderPath?: string;
    initialApiBaseUrl?: string;
    onClose: () => void;
    onSave: (email: string, password: string, folderPath: string, apiBaseUrl: string, verificationCode?: string) => Promise<{ requiresVerification?: boolean }>;
};

const EU_URL = 'https://eapi.pcloud.com';
const US_URL = 'https://api.pcloud.com';

const Field = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    right,
}: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
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

export function PCloudConfigModal({
    visible,
    initialEmail = '',
    initialFolderPath = '/',
    initialApiBaseUrl = US_URL,
    onClose,
    onSave,
}: Props) {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [folderPath, setFolderPath] = useState(initialFolderPath);
    const [isEu, setIsEu] = useState(initialApiBaseUrl === EU_URL);
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationStep, setVerificationStep] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const handleSave = async () => {
        if (!email.trim()) { setError("L'email est requis."); return; }
        if (!password) { setError('Le mot de passe est requis.'); return; }
        setError(null);
        setSaving(true);
        try {
            const result = await onSave(email.trim(), password, folderPath.trim() || '/', isEu ? EU_URL : US_URL);
            if (result.requiresVerification) {
                setVerificationStep(true);
            } else {
                onClose();
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erreur inconnue.');
        } finally {
            setSaving(false);
        }
    };

    const handleVerify = async () => {
        if (!verificationCode.trim()) { setError('Le code de vérification est requis.'); return; }
        setError(null);
        setSaving(true);
        try {
            await onSave(email.trim(), password, folderPath.trim() || '/', isEu ? EU_URL : US_URL, verificationCode.trim());
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
            setVerificationStep(false);
            setVerificationCode('');
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

                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.textPrimary, fontSize: 18, fontWeight: '600' }}>
                            {verificationStep ? 'Vérification email' : 'Connexion pCloud'}
                        </Text>
                        <Pressable onPress={handleClose} hitSlop={12}>
                            <X size={20} color={theme.colors.textMuted} />
                        </Pressable>
                    </View>

                    {verificationStep ? (
                        <>
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                                pCloud a envoyé un code de vérification à{' '}
                                <Text style={{ color: theme.colors.textPrimary }}>{email}</Text>.
                                Saisis-le ci-dessous pour finaliser la connexion.
                            </Text>
                            <Field
                                label="Code de vérification"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                placeholder="123456"
                            />
                        </>
                    ) : (
                        <>
                            <Field
                                label="Adresse email"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="ton@email.com"
                            />
                            <Field
                                label="Mot de passe pCloud"
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
                                placeholder="/Ma musique"
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>Datacenter</Text>
                                    <Text style={{ color: theme.colors.textMuted, fontSize: 11, marginTop: 2 }}>
                                        {isEu ? 'Europe (eapi.pcloud.com)' : 'États-Unis (api.pcloud.com)'}
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => setIsEu(v => !v)}
                                    style={{
                                        paddingHorizontal: theme.spacing.md,
                                        paddingVertical: theme.spacing.sm,
                                        borderRadius: 8,
                                        backgroundColor: isEu ? theme.colors.accentSoft : theme.colors.bgElevated,
                                        borderWidth: 1,
                                        borderColor: isEu ? theme.colors.accent : theme.colors.border,
                                    }}
                                >
                                    <Text style={{ color: isEu ? theme.colors.accent : theme.colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
                                        {isEu ? 'EU' : 'US'}
                                    </Text>
                                </Pressable>
                            </View>
                        </>
                    )}

                    {/* Error */}
                    {error && <Text style={{ color: theme.colors.error, fontSize: 13 }}>{error}</Text>}

                    {/* Actions */}
                    <View style={{ flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.xs }}>
                        <Pressable
                            onPress={handleClose}
                            style={{ flex: 1, paddingVertical: theme.spacing.md, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' }}
                        >
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 15, fontWeight: '500' }}>Annuler</Text>
                        </Pressable>
                        <Pressable
                            onPress={verificationStep ? handleVerify : handleSave}
                            disabled={saving}
                            style={{ flex: 1, paddingVertical: theme.spacing.md, borderRadius: 10, backgroundColor: saving ? theme.colors.accentSoft : theme.colors.accent, alignItems: 'center' }}
                        >
                            {saving
                                ? <ActivityIndicator size="small" color={theme.colors.bg} />
                                : <Text style={{ color: theme.colors.bg, fontSize: 15, fontWeight: '600' }}>
                                    {verificationStep ? 'Vérifier' : 'Connexion'}
                                </Text>}
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
