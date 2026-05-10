import { useNavigation } from "@react-navigation/native";
import { View, Text, Alert, TouchableOpacity, Switch, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { signOut, auth } from '../services/firebaseService';
import { useTheme } from '../constants/ThemeContext';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const { isDarkMode, toggleTheme, theme } = useTheme();

    const handleLogout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            Alert.alert('Sesión cerrada 😊', 'Has cerrado tu sesión correctamente');
        } catch (error) {
            console.log('Error al cerrar sesión:', error);
            Alert.alert('Error 😵‍💫', 'No se pudo cerrar la sesión');
        } finally {
            setLoading(false);
        }
    };

    const styles = createStyles(theme, isDarkMode);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Ionicons name="settings" size={28} color={theme.acento} />
                <Text style={styles.title}>Ajustes</Text>
            </View>

            {/* Sección: Apariencia */}
            <View style={styles.seccion}>
                <Text style={styles.seccionTitulo}>Apariencia</Text>

                <View style={styles.opcionFila}>
                    <View style={styles.opcionIzquierda}>
                        <View style={[styles.opcionIcono, { backgroundColor: isDarkMode ? '#2a2f3a' : '#e8f4fd' }]}>
                            <Ionicons
                                name={isDarkMode ? 'moon' : 'sunny'}
                                size={20}
                                color={isDarkMode ? '#a78bfa' : '#f59e0b'}
                            />
                        </View>
                        <View>
                            <Text style={styles.opcionLabel}>Modo oscuro</Text>
                            <Text style={styles.opcionDescripcion}>
                                {isDarkMode ? 'Tema oscuro activo' : 'Tema claro activo'}
                            </Text>
                        </View>
                    </View>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#d1d5db', true: '#10bfae' }}
                        thumbColor={isDarkMode ? '#ffffff' : '#ffffff'}
                        ios_backgroundColor="#d1d5db"
                    />
                </View>
            </View>

            {/* Sección: Cuenta */}
            <View style={styles.seccion}>
                <Text style={styles.seccionTitulo}>Cuenta</Text>

                <TouchableOpacity
                    style={styles.opcionBoton}
                    onPress={handleLogout}
                    disabled={loading}
                    activeOpacity={0.75}
                >
                    <View style={styles.opcionIzquierda}>
                        <View style={[styles.opcionIcono, { backgroundColor: '#fde8e8' }]}>
                            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        </View>
                        <Text style={[styles.opcionLabel, { color: '#ef4444' }]}>
                            {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ef4444" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.fondoApp,
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.textoTitulo,
    },
    seccion: {
        backgroundColor: theme.fondoTarjeta,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.fondoBorde,
        padding: 6,
        marginBottom: 20,
    },
    seccionTitulo: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.textoSubtitulo,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 6,
    },
    opcionFila: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    opcionBoton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    opcionIzquierda: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    opcionIcono: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    opcionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.textoTitulo,
    },
    opcionDescripcion: {
        fontSize: 12,
        color: theme.textoSubtitulo,
        marginTop: 1,
    },
});

export default SettingsScreen;
