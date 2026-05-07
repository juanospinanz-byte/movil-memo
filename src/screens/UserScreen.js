import React, { useState, useCallback } from "react";
import { View, Text, Alert, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { updateProfile } from "firebase/auth";
import { auth } from "../services/firebaseService";
import { pickImage, uploadImageToCloudinary } from "../services/cloudinaryService";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";

const { width } = Dimensions.get("window");

const UserScreen = ({ navigation }) => {
    const user = auth.currentUser;
    const defaultImage = 'https://ui-avatars.com/api/?name=' + (user?.displayName || 'Usuario') + '&background=1998CC&color=fff&size=256';
    const [imageUri, setImageUri] = useState(user?.photoURL || defaultImage);
    const [uploading, setUploading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                setImageUri(user.photoURL || defaultImage);
            }
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

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient 
                colors={[colors.principal, colors.variante2]} 
                style={styles.headerGradient}
            >
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </LinearGradient>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: imageUri }} style={styles.avatar} />
                    <TouchableOpacity style={styles.editBadge} onPress={handleImageSelection} disabled={uploading}>
                        {uploading ? (
                            <ActivityIndicator size="small" color={colors.iluminado} />
                        ) : (
                            <Ionicons name="camera" size={20} color={colors.iluminado} />
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>{user?.displayName || 'Usuario MovilMemo'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.fondloClaro,
    },
    headerGradient: {
        height: 180,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.iluminado,
        marginTop: -30,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: -60,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
        shadowColor: colors.oscuro,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: colors.iluminado,
        backgroundColor: colors.variante1,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.variante1,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.iluminado,
        shadowColor: colors.oscuro,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.principal,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 15,
        color: colors.variante2,
        marginBottom: 24,
        fontWeight: '500',
    },
});

export default UserScreen;