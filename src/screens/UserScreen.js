import { use, useCallback } from "react";
import colors from "../constants/colors";
import { View, Text, Alert, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { pickImage, uploadImageToCloudinary } from "../services/cloudinaryService";
import { ScrollView } from "react-native-gesture-handler";

const UserScreen = ({ navigation }) => {
    const {user} = useAuth();
    const [imageUri, setImageUri] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const defaultImage = ''; // URL de la imagen por defecto

    const fetchUserProfile = useCallback(async () => {
        if(user){
            setLoading(true);
            try {
                const firestoreUserData = await getUserData(user.uid);
                setUserData(firestoreUserData);
                setImageUri(firestoreUserData?.photoURL || user.photoURL || defaultImage);
            } catch (error) {
                console.error("Error al obteer los datos del perfil: ", error);
                setImageUri(user.photoURL || defaultImage);
            }finally{
                setLoading(false);
            }
        }
    },[user]);

    useFocusEffect(
        useCallback(()=>{
            fetchUserProfile();
        },[fetchUserProfile])
    );

    const handleImageSelection = async() =>{
        try {
            const imageAsset = await pickImage();
            if (imageAsset) {
                setSelectedImage(imageAsset);
                setShowPreview(true);
            }
        } catch (error) {
            console.error("Error al seleccionar la imagen: ", error);
            Alert.alert('Error 😵‍💫', 'No se pudo seleccionar la imagen')
        }
    };

    const handleCancelSelection=()=>{
        setSelectedImage(null);
        setShowPreview(false);
    }

    const handleConfirmUpload = async ()=>{
        if(!selectedImage) return;
        try {
            setLoading(true);
            setShowPreview(false);

            const imageUrl = await uploadImageToCloudinary(selectedImage.uri);
            await updateUserProfilePhoto(user.uid, imageUrl);

            setImageUri(imageUrl);

            setSelectedImage(null);
            Alert.alert('Éxito', 'Imagen de perfil actualizada satisfactoriamente!');
            
        } catch (error) {
            console.error('Error al caargar la imagen: ',error)
            Alert.alert('Error 😵‍💫', 'Imagen de perfil no se pudo actualizar');            
        } finally {
            setLoading(false);
        }

    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>User Screen</Text>
                <View>
                    <Image source={{uri:imageUri}} resizeMode="cover"/>
                    <TouchableOpacity onPress={handleImageSelection} disabled={loading} >
                        {loading ? (
                            <ActivityIndicator color="" size="small" />
                        ):(
                            <Text>Cambiar Foto</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user?.displayName || 'Usuario'}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>
            </View>
        </ScrollView>
        
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