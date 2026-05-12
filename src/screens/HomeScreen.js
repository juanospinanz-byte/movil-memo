import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Calendario from "../components/Calendario";
import { useTheme } from "../constants/ThemeContext";
import { auth } from "../services/firebaseService";

const HomeScreen = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();
    
    // Obtener información del usuario
    const user = auth.currentUser;
    const userName = user?.displayName || user?.email?.split('@')[0] || "Usuario";
    const initial = userName.charAt(0).toUpperCase();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.fondoApp }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.fondoApp} />
            
            <View style={styles.header}>
                <View style={styles.userInfo}>

                    <View style={styles.greetingContainer}>
                        <Text style={[styles.greeting, { color: theme.textoSubtitulo }]}>
                            {getGreeting()},
                        </Text>
                        <Text style={[styles.userName, { color: theme.textoTitulo }]} numberOfLines={1}>
                            {userName}
                        </Text>
                    </View>
                </View>
                

            </View>

            <View style={styles.content}>
                <Calendario />
            </View>
        </SafeAreaView>
    );
};

// Función para obtener saludo según la hora
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 5,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 15,
    },

    greetingContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 2,
        letterSpacing: 0.3,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },

    content: {
        flex: 1,
    }
});

export default HomeScreen;
