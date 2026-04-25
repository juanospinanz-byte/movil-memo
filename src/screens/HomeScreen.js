import { StyleSheet, View } from "react-native";
import colors from "../constants/colors";
import Calendario from "../components/Calendario";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Calendario />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.principal,
    },
});

export default HomeScreen;
