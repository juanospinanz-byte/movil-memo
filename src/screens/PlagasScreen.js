import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import sqliteService from '../services/sqliteService';
import { auth } from '../services/firebaseService';

const PlagasScreen = () => {
    const [plagas, setPlagas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tratamiento, setTratamiento] = useState('');

    useEffect(() => {
        cargarPlagas();
    }, []);

    const cargarPlagas = () => {
        const user = auth.currentUser;
        if (user) {
            const plagasCargadas = sqliteService.obtenerPlagasPorUsuario(user.uid);
            setPlagas(plagasCargadas || []);
        }
    };

    const handleGuardar = () => {
        if (!nombre.trim() || !descripcion.trim() || !tratamiento.trim()) {
            Alert.alert('Campos incompletos', 'Por favor llena todos los campos para agregar la plaga.');
            return;
        }

        const user = auth.currentUser;
        if (user) {
            const nuevaPlaga = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                tratamiento: tratamiento.trim(),
            };

            const plagaGuardada = sqliteService.guardarPlaga(nuevaPlaga, user.uid);
            if (plagaGuardada) {
                setPlagas((prev) => [plagaGuardada, ...prev]);
                Alert.alert('Plaga agregada', 'La plaga ha sido registrada correctamente.');
                setNombre('');
                setDescripcion('');
                setTratamiento('');
            } else {
                Alert.alert('Error', 'No se pudo guardar la plaga.');
            }
        } else {
            Alert.alert('Autenticación', 'No se pudo verificar tu sesión.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.plagaCard}>
            <View style={styles.plagaHeader}>
                <Ionicons name="bug" size={24} color={colors.alerta} />
                <Text style={styles.plagaNombre}>{item.nombre}</Text>
            </View>
            
            <View style={styles.plagaSeccion}>
                <Text style={styles.plagaLabel}>Descripción:</Text>
                <Text style={styles.plagaTexto}>{item.descripcion}</Text>
            </View>

            <View style={styles.plagaSeccion}>
                <Text style={styles.plagaLabel}>Tratamiento:</Text>
                <Text style={styles.plagaTexto}>{item.tratamiento}</Text>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Registro de Plagas</Text>
                
                <View style={styles.inputContainer}>
                    <Ionicons name="bug-outline" size={20} color={colors.variante1} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de la plaga"
                        placeholderTextColor={colors.suave}
                        value={nombre}
                        onChangeText={setNombre}
                    />
                </View>

                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                    <Ionicons name="document-text-outline" size={20} color={colors.variante1} style={[styles.inputIcon, {marginTop: 10}]} />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Descripción"
                        placeholderTextColor={colors.suave}
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                    <Ionicons name="medical-outline" size={20} color={colors.variante1} style={[styles.inputIcon, {marginTop: 10}]} />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Tratamiento recomendado"
                        placeholderTextColor={colors.suave}
                        value={tratamiento}
                        onChangeText={setTratamiento}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
                    <Ionicons name="save-outline" size={20} color={colors.iluminado} />
                    <Text style={styles.saveButtonText}>Guardar Plaga</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Plagas Registradas</Text>
                {plagas.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="leaf-outline" size={48} color={colors.suave} />
                        <Text style={styles.emptyText}>No hay plagas registradas aún</Text>
                    </View>
                ) : (
                    <FlatList
                        data={plagas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.fondloClaro,
    },
    formContainer: {
        backgroundColor: colors.iluminado,
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: colors.oscuro,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.principal,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.fondloClaro,
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.suave,
    },
    textAreaContainer: {
        alignItems: 'flex-start',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: colors.oscuro,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    saveButton: {
        backgroundColor: colors.defecto,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
        gap: 8,
    },
    saveButtonText: {
        color: colors.iluminado,
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.principal,
        marginBottom: 15,
    },
    plagaCard: {
        backgroundColor: colors.iluminado,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: colors.alerta,
        shadowColor: colors.oscuro,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    plagaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    plagaNombre: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.principal,
        flex: 1,
    },
    plagaSeccion: {
        marginBottom: 8,
    },
    plagaLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.variante2,
        marginBottom: 2,
    },
    plagaTexto: {
        fontSize: 15,
        color: colors.oscuro,
        lineHeight: 22,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.suave,
    }
});

export default PlagasScreen;
