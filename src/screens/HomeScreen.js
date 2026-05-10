import { StyleSheet, View } from "react-native";
import Calendario from "../components/Calendario";
import { useTheme } from "../constants/ThemeContext";

const HomeScreen = () => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.fondoApp }]}>
            <Calendario />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default HomeScreen;
