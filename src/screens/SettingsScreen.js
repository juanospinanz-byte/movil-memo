import { useNavigation } from "@react-navigation/native";
import colors from "../constants/colors";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { useState } from "react";
import {signOut, auth} from '../services/firebaseService';


const SettingsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            Alert.alert('Sesión cerrada 😊', 'Has cerrado tu sesión correctamente',[
                {text: 'OK', onPress:()=> navigation
                    .reset({index: 0, routes: [{name:'Login'}]})}
            ])
        } catch (error) {
            console.log('Error al cerrar sesión:',error)
            Alert.alert('Error 😵‍💫','No se pudo cerrar la sesión')
        }finally {
            setLoading(false);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajustes</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
                
                    <Text style={styles.logoutText}> Cerrar sesión ❌</Text>
                
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.principal,
    },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.principal,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtle,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: colors.error,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: '600',
  },
};

export default SettingsScreen;
