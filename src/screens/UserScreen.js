import { use, useCallback } from "react";
import colors from "../constants/colors";
import { View, Text } from "react-native";

const UserScreen = ({ navegation }) => {
    const {user} = useAuth();
    const [imageUri, setImageUri] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const defaultImage = '';

    const fetchUserprofile = useCallback(async () => {
        if(user){
            setLoading(true);
            try {
                const firestorerUserData = await getUserData(user.uid);
                setUserData(firestorerUserData);
                setImageUri(firestorerUserData?.photoURL || user.photoURL  || defaultImage);
            } catch (error) {
                
            }finally{
                setLoading(false)
            }
        }
    },[user]);

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
