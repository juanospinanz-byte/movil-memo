import colors from "../constants/colors";
import { View, Text } from "react-native";

const UserScreen = () => {
    return (
        <View style={styles.container}>
            <Text>User Screen</Text>
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

export default UserScreen;
