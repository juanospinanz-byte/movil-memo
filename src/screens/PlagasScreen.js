import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList,
    StyleSheet, Alert, Modal, ScrollView,
    KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import sqliteService from '../services/sqliteService';
import { auth } from '../services/firebaseService';
import { useTheme } from '../constants/ThemeContext';

const { width } = Dimensions.get('window');

// Paleta de colores de severidad
const NIVELES = [
    { label: 'Leve',     color: '#22c55e', bg: '#dcfce7', icon: 'checkmark-circle-outline' },
    { label: 'Moderado', color: '#f59e0b', bg: '#fef3c7', icon: 'warning-outline'           },
    { label: 'Severo',   color: '#ef4444', bg: '#fee2e2', icon: 'alert-circle-outline'      },
];

const PlagasScreen = () => {
    const [plagas, setPlagas]         = useState([]);
    const [nombre, setNombre]         = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tratamiento, setTratamiento] = useState('');
    const [nivel, setNivel]           = useState(0); // índice en NIVELES
    const [modalVisible, setModalVisible] = useState(false);
    const [plagaDetalle, setPlagaDetalle] = useState(null);
    const { theme, isDarkMode } = useTheme();

    useEffect(() => { cargarPlagas(); }, []);

    const cargarPlagas = () => {
        const user = auth.currentUser;
        if (user) {
            const cargadas = sqliteService.obtenerPlagasPorUsuario(user.uid);
            setPlagas(cargadas || []);
        }
    };

    const handleGuardar = () => {
        if (!nombre.trim() || !descripcion.trim() || !tratamiento.trim()) {
            Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
            return;
        }
        const user = auth.currentUser;
        if (!user) { Alert.alert('Autenticación', 'No se pudo verificar tu sesión.'); return; }

        const nuevaPlaga = {
            nombre:      nombre.trim(),
            descripcion: descripcion.trim(),
            tratamiento: tratamiento.trim(),
            nivel:       NIVELES[nivel].label,
        };

        const guardada = sqliteService.guardarPlaga(nuevaPlaga, user.uid);
        if (guardada) {
            setPlagas(prev => [guardada, ...prev]);
            setNombre(''); setDescripcion(''); setTratamiento(''); setNivel(0);
            setModalVisible(false);
            Alert.alert('✅ Plaga registrada', 'Se guardó correctamente.');
        } else {
            Alert.alert('Error', 'No se pudo guardar la plaga.');
        }
    };

    const abrirDetalle = (plaga) => { setPlagaDetalle(plaga); };
    const cerrarDetalle = () => setPlagaDetalle(null);

    const getNivelInfo = (nivelLabel) =>
        NIVELES.find(n => n.label === nivelLabel) || NIVELES[0];

    const styles = createStyles(theme, isDarkMode);

    /* ── Tarjeta de plaga ── */
    const renderItem = ({ item, index }) => {
        const nivelInfo = getNivelInfo(item.nivel);
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => abrirDetalle(item)}
                activeOpacity={0.75}
            >
                {/* Barra de color lateral */}
                <View style={[styles.cardAccent, { backgroundColor: nivelInfo.color }]} />

                <View style={styles.cardBody}>
                    {/* Fila superior */}
                    <View style={styles.cardTop}>
                        <View style={[styles.cardIconBox, { backgroundColor: nivelInfo.bg }]}>
                            <Ionicons name="bug" size={22} color={nivelInfo.color} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardNombre} numberOfLines={1}>{item.nombre}</Text>
                            <View style={[styles.nivelBadge, { backgroundColor: nivelInfo.bg }]}>
                                <Ionicons name={nivelInfo.icon} size={11} color={nivelInfo.color} />
                                <Text style={[styles.nivelBadgeText, { color: nivelInfo.color }]}>
                                    {nivelInfo.label}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.textoSubtitulo} />
                    </View>

                    {/* Descripción truncada */}
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.descripcion}</Text>

                    {/* Chip de tratamiento */}
                    <View style={styles.tratamientoChip}>
                        <Ionicons name="medical-outline" size={13} color={theme.acento} />
                        <Text style={styles.tratamientoChipText} numberOfLines={1}>{item.tratamiento}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* ── Header con gradiente ── */}
            <LinearGradient
                colors={theme.gradientePrimario}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerDecor1} />
                <View style={styles.headerDecor2} />
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerSub}>Control de</Text>
                        <Text style={styles.headerTitle}>Plagas 🐛</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="add" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>

                {/* Estadística rápida */}
                <View style={styles.statsRow}>
                    <View style={styles.statChip}>
                        <Ionicons name="list-outline" size={14} color="#ffffff" />
                        <Text style={styles.statText}>{plagas.length} registradas</Text>
                    </View>
                    {NIVELES.map(n => {
                        const count = plagas.filter(p => p.nivel === n.label).length;
                        if (count === 0) return null;
                        return (
                            <View key={n.label} style={[styles.statChip, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                                <View style={[styles.statDot, { backgroundColor: n.color }]} />
                                <Text style={styles.statText}>{count} {n.label.toLowerCase()}</Text>
                            </View>
                        );
                    })}
                </View>
            </LinearGradient>

            {/* ── Lista ── */}
            {plagas.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconBox}>
                        <Ionicons name="leaf" size={44} color={isDarkMode ? '#10bfae66' : '#10bfae44'} />
                    </View>
                    <Text style={styles.emptyTitle}>Sin plagas registradas</Text>
                    <Text style={styles.emptySubtitle}>Toca el botón + para agregar tu primer registro</Text>
                    <TouchableOpacity
                        style={styles.emptyBtn}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
                        <Text style={styles.emptyBtnText}>Agregar plaga</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={plagas}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                />
            )}

            {/* ── Modal: Registrar plaga ── */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ width: '100%' }}
                    >
                        <View style={styles.modalSheet}>
                            {/* Handle */}
                            <View style={styles.modalHandle} />

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Nueva plaga</Text>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    style={styles.modalCloseBtn}
                                >
                                    <Ionicons name="close" size={20} color={theme.textoSubtitulo} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Campo: Nombre */}
                                <Text style={styles.fieldLabel}>Nombre de la plaga</Text>
                                <View style={styles.fieldBox}>
                                    <Ionicons name="bug-outline" size={18} color={theme.acento} />
                                    <TextInput
                                        style={styles.fieldInput}
                                        placeholder="Ej. Cucaracha alemana"
                                        placeholderTextColor={theme.textoSubtitulo}
                                        value={nombre}
                                        onChangeText={setNombre}
                                    />
                                </View>

                                {/* Campo: Descripción */}
                                <Text style={styles.fieldLabel}>Descripción</Text>
                                <View style={[styles.fieldBox, styles.fieldBoxArea]}>
                                    <Ionicons name="document-text-outline" size={18} color={theme.acento} style={{ marginTop: 2 }} />
                                    <TextInput
                                        style={[styles.fieldInput, styles.fieldInputArea]}
                                        placeholder="Describe el problema o ubicación..."
                                        placeholderTextColor={theme.textoSubtitulo}
                                        value={descripcion}
                                        onChangeText={setDescripcion}
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>

                                {/* Campo: Tratamiento */}
                                <Text style={styles.fieldLabel}>Tratamiento recomendado</Text>
                                <View style={[styles.fieldBox, styles.fieldBoxArea]}>
                                    <Ionicons name="medical-outline" size={18} color={theme.acento} style={{ marginTop: 2 }} />
                                    <TextInput
                                        style={[styles.fieldInput, styles.fieldInputArea]}
                                        placeholder="Describe el tratamiento a aplicar..."
                                        placeholderTextColor={theme.textoSubtitulo}
                                        value={tratamiento}
                                        onChangeText={setTratamiento}
                                        multiline
                                        numberOfLines={3}
                                    />
                                </View>

                                {/* Nivel de severidad */}
                                <Text style={styles.fieldLabel}>Nivel de severidad</Text>
                                <View style={styles.nivelSelector}>
                                    {NIVELES.map((n, i) => (
                                        <TouchableOpacity
                                            key={n.label}
                                            style={[
                                                styles.nivelOption,
                                                { borderColor: n.color },
                                                nivel === i && { backgroundColor: n.color },
                                            ]}
                                            onPress={() => setNivel(i)}
                                            activeOpacity={0.8}
                                        >
                                            <Ionicons
                                                name={n.icon}
                                                size={15}
                                                color={nivel === i ? '#ffffff' : n.color}
                                            />
                                            <Text style={[
                                                styles.nivelOptionText,
                                                { color: nivel === i ? '#ffffff' : n.color },
                                            ]}>
                                                {n.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Botón guardar */}
                                <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar} activeOpacity={0.85}>
                                    <LinearGradient
                                        colors={['#10bfae', '#08a898']}
                                        style={styles.saveBtnGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Ionicons name="save-outline" size={20} color="#ffffff" />
                                        <Text style={styles.saveBtnText}>Guardar plaga</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* ── Modal: Detalle de plaga ── */}
            <Modal
                visible={plagaDetalle !== null}
                animationType="slide"
                transparent
                onRequestClose={cerrarDetalle}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalSheet, { paddingBottom: 30 }]}>
                        <View style={styles.modalHandle} />

                        {plagaDetalle && (() => {
                            const nivelInfo = getNivelInfo(plagaDetalle.nivel);
                            return (
                                <>
                                    {/* Header del detalle */}
                                    <View style={styles.detalleHeader}>
                                        <View style={[styles.detalleIconCircle, { backgroundColor: nivelInfo.bg }]}>
                                            <Ionicons name="bug" size={28} color={nivelInfo.color} />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 14 }}>
                                            <Text style={styles.detalleNombre}>{plagaDetalle.nombre}</Text>
                                            <View style={[styles.nivelBadge, { backgroundColor: nivelInfo.bg, alignSelf: 'flex-start' }]}>
                                                <Ionicons name={nivelInfo.icon} size={12} color={nivelInfo.color} />
                                                <Text style={[styles.nivelBadgeText, { color: nivelInfo.color }]}>{nivelInfo.label}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={cerrarDetalle} style={styles.modalCloseBtn}>
                                            <Ionicons name="close" size={20} color={theme.textoSubtitulo} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.detalleDivider} />

                                    {/* Descripción */}
                                    <View style={styles.detalleSeccion}>
                                        <View style={styles.detalleSeccionHeader}>
                                            <Ionicons name="document-text-outline" size={16} color={theme.acento} />
                                            <Text style={styles.detalleSeccionLabel}>Descripción</Text>
                                        </View>
                                        <Text style={styles.detalleSeccionTexto}>{plagaDetalle.descripcion}</Text>
                                    </View>

                                    {/* Tratamiento */}
                                    <View style={[styles.detalleSeccion, { backgroundColor: isDarkMode ? '#0d2f2a' : '#f0fdf8', borderColor: '#10bfae33' }]}>
                                        <View style={styles.detalleSeccionHeader}>
                                            <Ionicons name="medical-outline" size={16} color={theme.acento} />
                                            <Text style={styles.detalleSeccionLabel}>Tratamiento recomendado</Text>
                                        </View>
                                        <Text style={styles.detalleSeccionTexto}>{plagaDetalle.tratamiento}</Text>
                                    </View>

                                    <TouchableOpacity style={styles.cerrarBtn} onPress={cerrarDetalle}>
                                        <Text style={styles.cerrarBtnText}>Cerrar</Text>
                                    </TouchableOpacity>
                                </>
                            );
                        })()}
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.fondoApp,
    },

    // ── Header ──
    header: {
        paddingTop: 54,
        paddingBottom: 20,
        paddingHorizontal: 20,
        overflow: 'hidden',
    },
    headerDecor1: {
        position: 'absolute', width: 180, height: 180,
        borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.07)',
        top: -50, right: -40,
    },
    headerDecor2: {
        position: 'absolute', width: 100, height: 100,
        borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)',
        top: 60, left: -20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerSub: {
        fontSize: 12, color: 'rgba(255,255,255,0.7)',
        fontWeight: '500', letterSpacing: 0.5, marginBottom: 2,
    },
    headerTitle: {
        fontSize: 26, fontWeight: '800', color: '#ffffff',
    },
    addBtn: {
        width: 46, height: 46, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    },
    statsRow: {
        flexDirection: 'row', gap: 8, flexWrap: 'wrap',
    },
    statChip: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 20,
    },
    statDot: { width: 7, height: 7, borderRadius: 4 },
    statText: { fontSize: 12, color: '#ffffff', fontWeight: '600' },

    // ── Lista ──
    list: {
        padding: 16, paddingTop: 14,
    },

    // ── Tarjeta ──
    card: {
        flexDirection: 'row',
        backgroundColor: theme.fondoTarjeta,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.fondoBorde,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDarkMode ? 0.3 : 0.07,
        shadowRadius: 8,
        elevation: 4,
    },
    cardAccent: {
        width: 5,
    },
    cardBody: {
        flex: 1,
        padding: 14,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardIconBox: {
        width: 44, height: 44,
        borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    cardNombre: {
        fontSize: 16, fontWeight: '700',
        color: theme.textoTitulo, marginBottom: 4,
    },
    nivelBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: 20, alignSelf: 'flex-start',
    },
    nivelBadgeText: {
        fontSize: 11, fontWeight: '700',
    },
    cardDesc: {
        fontSize: 13, color: theme.textoSubtitulo,
        lineHeight: 19, marginBottom: 10,
    },
    tratamientoChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: isDarkMode ? '#0d2f2a' : '#e6f8f5',
        paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 20,
    },
    tratamientoChipText: {
        fontSize: 12, fontWeight: '600', color: theme.acento, flex: 1,
    },

    // ── Empty ──
    emptyContainer: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyIconBox: {
        width: 96, height: 96, borderRadius: 48,
        backgroundColor: isDarkMode ? '#1c2330' : '#f0fdf8',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1, borderColor: isDarkMode ? '#10bfae22' : '#10bfae33',
    },
    emptyTitle: {
        fontSize: 19, fontWeight: '700',
        color: theme.textoTitulo, marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14, color: theme.textoSubtitulo,
        textAlign: 'center', lineHeight: 20, marginBottom: 24,
    },
    emptyBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#10bfae',
        paddingHorizontal: 22, paddingVertical: 12,
        borderRadius: 12,
    },
    emptyBtnText: {
        color: '#ffffff', fontWeight: '700', fontSize: 15,
    },

    // ── Modal base ──
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: theme.fondoTarjeta,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
        maxHeight: '92%',
    },
    modalHandle: {
        width: 40, height: 4,
        backgroundColor: isDarkMode ? '#3a4350' : '#d1d5db',
        borderRadius: 2, alignSelf: 'center', marginBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    modalTitle: {
        fontSize: 20, fontWeight: '800', color: theme.textoTitulo,
    },
    modalCloseBtn: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: isDarkMode ? '#2a3340' : '#f0f2f6',
        justifyContent: 'center', alignItems: 'center',
    },

    // ── Formulario ──
    fieldLabel: {
        fontSize: 12, fontWeight: '700',
        color: theme.textoSubtitulo,
        textTransform: 'uppercase', letterSpacing: 0.6,
        marginBottom: 8, marginTop: 4,
    },
    fieldBox: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: theme.fondoInput,
        borderRadius: 12, borderWidth: 1,
        borderColor: theme.fondoBorde,
        paddingHorizontal: 14, marginBottom: 12,
        minHeight: 50,
    },
    fieldBoxArea: {
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    fieldInput: {
        flex: 1, fontSize: 15,
        color: theme.textoTitulo,
        height: 50,
    },
    fieldInputArea: {
        height: undefined, minHeight: 70,
        textAlignVertical: 'top',
    },
    nivelSelector: {
        flexDirection: 'row', gap: 8, marginBottom: 20,
    },
    nivelOption: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 5,
        paddingVertical: 10, borderRadius: 10,
        borderWidth: 1.5,
    },
    nivelOptionText: {
        fontSize: 12, fontWeight: '700',
    },
    saveBtn: {
        borderRadius: 14, overflow: 'hidden', marginTop: 4,
    },
    saveBtnGradient: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 10,
        paddingVertical: 15,
    },
    saveBtnText: {
        color: '#ffffff', fontWeight: '700', fontSize: 16,
    },

    // ── Detalle ──
    detalleHeader: {
        flexDirection: 'row', alignItems: 'center',
        marginBottom: 16,
    },
    detalleIconCircle: {
        width: 56, height: 56, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center',
    },
    detalleNombre: {
        fontSize: 19, fontWeight: '800',
        color: theme.textoTitulo, marginBottom: 6,
    },
    detalleDivider: {
        height: 1, backgroundColor: theme.fondoBorde, marginBottom: 16,
    },
    detalleSeccion: {
        backgroundColor: theme.fondoSecundario,
        borderRadius: 12, padding: 14,
        borderWidth: 1, borderColor: theme.fondoBorde,
        marginBottom: 12,
    },
    detalleSeccionHeader: {
        flexDirection: 'row', alignItems: 'center',
        gap: 8, marginBottom: 8,
    },
    detalleSeccionLabel: {
        fontSize: 11, fontWeight: '700',
        color: theme.textoSubtitulo,
        textTransform: 'uppercase', letterSpacing: 0.6,
    },
    detalleSeccionTexto: {
        fontSize: 15, color: theme.textoTitulo,
        lineHeight: 22,
    },
    cerrarBtn: {
        backgroundColor: '#10bfae',
        borderRadius: 12, paddingVertical: 14,
        alignItems: 'center', marginTop: 6,
    },
    cerrarBtnText: {
        color: '#ffffff', fontWeight: '700', fontSize: 15,
    },
});

export default PlagasScreen;
