import { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Calendario from "../components/Calendario";
import { useTheme } from "../constants/ThemeContext";
import { auth } from "../services/firebaseService";

const HomeScreen = () => {
    const { theme } = useTheme();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserName(user.displayName || user.email?.split('@')[0] || 'Usuario');
        }
    }, []);

    const getCurrentDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date().toLocaleDateString('es-ES', options);
        return date.charAt(0).toUpperCase() + date.slice(1);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.fondoApp }]}>
            <View style={[styles.container, { backgroundColor: theme.fondoApp }]}>
                {/* Encabezado Superior */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: theme.textoSubtitulo }]}>
                            ¡Hola, {userName || 'Usuario'}! 👋
                        </Text>
                        <Text style={[styles.dateText, { color: theme.textoTitulo }]}>
                            {getCurrentDate()}
                        </Text>
                    </View>
                    <View style={[styles.iconContainer, { backgroundColor: theme.fondoTarjeta, borderColor: theme.fondoBorde, borderWidth: 1 }]}>
                        <Ionicons name="notifications-outline" size={22} color={theme.acento || "#10bfae"} />
                        <View style={styles.notificationDot} />
                    </View>
                </View>

                {/* Subtítulo o Sección */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textoTitulo }]}>Tu Agenda</Text>
                    <Text style={[styles.sectionSubtitle, { color: theme.textoSubtitulo }]}>Organiza tus órdenes de servicio</Text>
                </View>

                {/* Calendario */}
                <View style={styles.calendarContainer}>
                    <Calendario />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    greeting: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 20,
        fontWeight: '800',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e74c3c',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
    },
    sectionSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    calendarContainer: {
        flex: 1,
    },
});

export default HomeScreen;
