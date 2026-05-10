import React, { useState, useCallback } from "react";
import {
    View, Text, Alert, Image, TouchableOpacity,
    ActivityIndicator, StyleSheet, Dimensions, ScrollView
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { updateProfile } from "firebase/auth";
import { auth } from "../services/firebaseService";
import { pickImage, uploadImageToCloudinary } from "../services/cloudinaryService";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../constants/ThemeContext";

const { width } = Dimensions.get("window");

const InfoCard = ({ icon, label, value, theme, isDarkMode }) => (
    <View style={cardStyles(theme, isDarkMode).infoCard}>
        <View style={cardStyles(theme, isDarkMode).infoIconBox}>
            <Ionicons name={icon} size={20} color="#10bfae" />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={cardStyles(theme, isDarkMode).infoLabel}>{label}</Text>
            <Text style={cardStyles(theme, isDarkMode).infoValue} numberOfLines={1}>{value || '—'}</Text>
        </View>
    </View>
);

const cardStyles = (theme, isDarkMode) => StyleSheet.create({
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: theme.fondoTarjeta,
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.fondoBorde,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.3 : 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    infoIconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: isDarkMode ? '#0d2f2a' : '#e6f8f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.textoSubtitulo,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.textoTitulo,
    },
});

const UserScreen = () => {
    const user = auth.currentUser;
    const { theme, isDarkMode } = useTheme();
    const defaultImage = 'https://ui-avatars.com/api/?name=' +
        (user?.displayName || 'U') + '&background=10bfae&color=fff&size=256&bold=true';
    const [imageUri, setImageUri] = useState(user?.photoURL || defaultImage);
    const [uploading, setUploading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (user) setImageUri(user.photoURL || defaultImage);
        }, [user])
    );

    const handleImageSelection = async () => {
        try {
            const imageAsset = await pickImage();
            if (imageAsset) {
                setUploading(true);
                const imageUrl = await uploadImageToCloudinary(imageAsset.uri);
                if (user && imageUrl) {
                    await updateProfile(user, { photoURL: imageUrl });
                    setImageUri(imageUrl);
                    Alert.alert('Éxito 🎉', 'Tu foto de perfil se actualizó correctamente.');
                }
            }
        } catch (error) {
            console.error("Error al actualizar la imagen: ", error);
            Alert.alert('Error 😵‍💫', 'Hubo un problema al subir tu foto.');
        } finally {
            setUploading(false);
        }
    };

    // Fecha de creación de cuenta formateada
    const memberSince = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
        : null;

    // Proveedor de autenticación
    const provider = user?.providerData?.[0]?.providerId === 'google.com'
        ? 'Google'
        : user?.providerData?.[0]?.providerId === 'password'
            ? 'Email / Contraseña'
            : 'Desconocido';

    const styles = createStyles(theme, isDarkMode);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {/* ── Header con gradiente ── */}
            <LinearGradient
                colors={theme.gradientePrimario}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Círculos decorativos */}
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                <View style={styles.headerContent}>
                    <Text style={styles.headerGreeting}>Bienvenido de nuevo</Text>
                    <Text style={styles.headerTitle}>
                        {user?.displayName?.split(' ')[0] || 'Usuario'} 👋
                    </Text>
                </View>
            </LinearGradient>

            {/* ── Avatar flotante ── */}
            <View style={styles.avatarWrapper}>
                <View style={styles.avatarRing}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={handleImageSelection}
                        disabled={uploading}
                        activeOpacity={0.85}
                    >
                        <Image source={{ uri: imageUri }} style={styles.avatar} />
                        <View style={styles.editOverlay}>
                            {uploading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <Ionicons name="camera" size={18} color="#ffffff" />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>{user?.displayName || 'Usuario MovilMemo'}</Text>
                <View style={styles.emailRow}>
                    <Ionicons name="mail-outline" size={14} color={theme.textoSubtitulo} />
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                {/* Badge de verificado */}
                {user?.emailVerified && (
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#10bfae" />
                        <Text style={styles.verifiedText}>Cuenta verificada</Text>
                    </View>
                )}
            </View>

            {/* ── Sección: Información de la cuenta ── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información de cuenta</Text>

                <InfoCard
                    icon="person-outline"
                    label="Nombre completo"
                    value={user?.displayName}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
                <InfoCard
                    icon="mail-outline"
                    label="Correo electrónico"
                    value={user?.email}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
                <InfoCard
                    icon="shield-checkmark-outline"
                    label="Método de acceso"
                    value={provider}
                    theme={theme}
                    isDarkMode={isDarkMode}
                />
                {memberSince && (
                    <InfoCard
                        icon="calendar-outline"
                        label="Miembro desde"
                        value={memberSince}
                        theme={theme}
                        isDarkMode={isDarkMode}
                    />
                )}
            </View>

            {/* ── Sección: Acciones ── */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acciones</Text>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleImageSelection}
                    disabled={uploading}
                    activeOpacity={0.75}
                >
                    <View style={[styles.actionIconBox, { backgroundColor: isDarkMode ? '#0d2f2a' : '#e6f8f5' }]}>
                        <Ionicons name="image-outline" size={20} color="#10bfae" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.actionLabel}>Cambiar foto de perfil</Text>
                        <Text style={styles.actionSub}>Sube una nueva imagen desde tu galería</Text>
                    </View>
                    {uploading
                        ? <ActivityIndicator size="small" color="#10bfae" />
                        : <Ionicons name="chevron-forward" size={18} color={theme.textoSubtitulo} />
                    }
                </TouchableOpacity>
            </View>

            {/* ── UID técnico (colapsado, estilo developer) ── */}
            {user?.uid && (
                <View style={styles.uidContainer}>
                    <Ionicons name="finger-print-outline" size={13} color={theme.textoSubtitulo} />
                    <Text style={styles.uidText} numberOfLines={1}>
                        UID: {user.uid}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.fondoApp,
    },

    // ── Header ──
    headerGradient: {
        height: 220,
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'flex-end',
        paddingBottom: 60,
        paddingHorizontal: 24,
    },
    decorCircle1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.07)',
        top: -60,
        right: -50,
    },
    decorCircle2: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: 40,
        left: -30,
    },
    headerContent: {
        zIndex: 1,
    },
    headerGreeting: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        fontWeight: '500',
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: -0.3,
    },

    // ── Avatar ──
    avatarWrapper: {
        alignItems: 'center',
        marginTop: -52,
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    avatarRing: {
        padding: 4,
        borderRadius: 70,
        backgroundColor: theme.fondoApp,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isDarkMode ? 0.4 : 0.15,
        shadowRadius: 12,
        elevation: 10,
    },
    avatarContainer: {
        width: 108,
        height: 108,
        borderRadius: 54,
        overflow: 'hidden',
        position: 'relative',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    editOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 34,
        backgroundColor: 'rgba(0,0,0,0.52)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.textoTitulo,
        marginBottom: 4,
        letterSpacing: -0.2,
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10,
    },
    userEmail: {
        fontSize: 13,
        color: theme.textoSubtitulo,
        fontWeight: '500',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: isDarkMode ? '#0d2f2a' : '#e6f8f5',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isDarkMode ? '#10bfae44' : '#10bfae33',
    },
    verifiedText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#10bfae',
    },

    // ── Secciones ──
    section: {
        paddingHorizontal: 18,
        marginTop: 22,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.textoSubtitulo,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
    },

    // ── Acción ──
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: theme.fondoTarjeta,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.fondoBorde,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.3 : 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    actionIconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.textoTitulo,
        marginBottom: 2,
    },
    actionSub: {
        fontSize: 12,
        color: theme.textoSubtitulo,
    },

    // ── UID ──
    uidContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginHorizontal: 18,
        marginTop: 28,
        padding: 10,
        borderRadius: 8,
        backgroundColor: isDarkMode ? '#1c2330' : '#f0f4f8',
        borderWidth: 1,
        borderColor: theme.fondoBorde,
    },
    uidText: {
        fontSize: 11,
        color: theme.textoSubtitulo,
        fontFamily: 'monospace',
        flex: 1,
    },
});

export default UserScreen;