import colors from "../constants/colors";
import { View, Text } from "react-native";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.principal,
    }
};

export default HomeScreen;
