import { useState } from "react";
import { Alert, ScrollView, View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import Formulario from "./Formulario";

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const obtenerDiasDelMes = (anio, mes) => {
    return new Date(anio, mes + 1, 0).getDate();
};

const obtenerPrimerDia = (anio, mes) => {
    return new Date(anio, mes, 1).getDay();
};

const Calendario = () => {
    const hoy = new Date();
    const [mesActual, setMesActual] = useState(hoy.getMonth());
    const [anioActual, setAnioActual] = useState(hoy.getFullYear());
    const [diaSeleccionado, setDiaSeleccionado] = useState(hoy.getDate());
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [ordenes, setOrdenes] = useState([]);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [ordenProgramada, setOrdenProgramada] = useState({
        fechaProgramada: '',
        servicio: '',
        tecnico: '',
        costo: '',
        horaInicio: '',
        horaFin: '',
        descripcion: '',
        cliente: '',
    });

    const totalDias = obtenerDiasDelMes(anioActual, mesActual);
    const primerDia = obtenerPrimerDia(anioActual, mesActual);

    const irMesAnterior = () => {
        if (mesActual === 0) {
            setMesActual(11);
            setAnioActual(anioActual - 1);
        } else {
            setMesActual(mesActual - 1);
        }
        setDiaSeleccionado(null);
    };

    const irMesSiguiente = () => {
        if (mesActual === 11) {
            setMesActual(0);
            setAnioActual(anioActual + 1);
        } else {
            setMesActual(mesActual + 1);
        }
        setDiaSeleccionado(null);
    };

    const esHoy = (dia) => {
        return (
            dia === hoy.getDate() &&
            mesActual === hoy.getMonth() &&
            anioActual === hoy.getFullYear()
        );
    };

    const celdas = [];

    const formatearFecha = (dia, mes, anio) => {
        if (!dia) return '';
        const diaConCero = String(dia).padStart(2, '0');
        const mesConCero = String(mes + 1).padStart(2, '0');
        return `${diaConCero}/${mesConCero}/${anio}`;
    };

    const actualizarCampo = (campo, valor) => {
        setOrdenProgramada((estadoAnterior) => ({
            ...estadoAnterior,
            [campo]: valor,
        }));
    };

    const alternarFormulario = () => {
        const fechaActual = formatearFecha(diaSeleccionado, mesActual, anioActual);
        setMostrarFormulario((estadoAnterior) => !estadoAnterior);
        setOrdenProgramada((estadoAnterior) => ({
            ...estadoAnterior,
            fechaProgramada: estadoAnterior.fechaProgramada || fechaActual,
        }));
    };

    const guardarOrden = () => {
        const [diaTexto, mesTexto, anioTexto] = ordenProgramada.fechaProgramada.split('/');
        const dia = Number(diaTexto);
        const mes = Number(mesTexto);
        const anio = Number(anioTexto);

        if (
            !dia ||
            !mes ||
            !anio ||
            !ordenProgramada.servicio.trim() ||
            !ordenProgramada.tecnico.trim()
        ) {
            Alert.alert('Datos incompletos', 'Completa fecha, servicio y técnico para guardar.');
            return;
        }

        const nuevaOrden = {
            id: `${Date.now()}-${Math.random()}`,
            dia,
            mes,
            anio,
            servicio: ordenProgramada.servicio.trim(),
            tecnico: ordenProgramada.tecnico.trim(),
            horaInicio: ordenProgramada.horaInicio.trim(),
            horaFin: ordenProgramada.horaFin.trim(),
            costo: ordenProgramada.costo.trim(),
            descripcion: ordenProgramada.descripcion.trim(),
            cliente: ordenProgramada.cliente.trim(),
            fechaProgramada: ordenProgramada.fechaProgramada,
        };

        setOrdenes((ordenesAnteriores) => [...ordenesAnteriores, nuevaOrden]);
        setOrdenProgramada((estadoAnterior) => ({
            ...estadoAnterior,
            servicio: '',
            tecnico: '',
            costo: '',
            horaInicio: '',
            horaFin: '',
            descripcion: '',
            cliente: '',
        }));
        Alert.alert('Orden programada', 'La orden fue registrada correctamente.');
    };

    for (let i = 0; i < primerDia; i++) {
        celdas.push(<View key={`vacio-${i}`} style={styles.celda} />);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const seleccionado = diaSeleccionado === dia;
        const hoyDia = esHoy(dia);
        const ordenesDelDia = ordenes.filter(
            (orden) => orden.dia === dia && orden.mes === mesActual + 1 && orden.anio === anioActual
        );

        celdas.push(
            <TouchableOpacity
                key={`dia-${dia}`}
                style={[
                    styles.celda,
                    hoyDia && styles.celdaHoy,
                    seleccionado && styles.celdaSeleccionada,
                ]}
                        onPress={() => {
                            setDiaSeleccionado(dia);
                            if (mostrarFormulario) {
                                actualizarCampo('fechaProgramada', formatearFecha(dia, mesActual, anioActual));
                            }
                        }}
            >
                <Text
                    style={[
                        styles.textoDia,
                        hoyDia && styles.textoHoy,
                        seleccionado && styles.textoSeleccionado,
                    ]}
                >
                    {dia}
                </Text>
                <View style={styles.contenedorTiritas}>
                    {ordenesDelDia.slice(0, 2).map((orden) => (
                        <TouchableOpacity
                            key={orden.id}
                            style={styles.tiritaOrden}
                            onPress={(e) => {
                                e.stopPropagation && e.stopPropagation();
                                setOrdenSeleccionada(orden);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.textoTirita} numberOfLines={1}>
                                {orden.horaInicio ? `${orden.horaInicio} ` : ''}{orden.servicio}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {ordenesDelDia.length > 2 && (
                        <TouchableOpacity onPress={() => {
                            setDiaSeleccionado(dia);
                            setOrdenSeleccionada(ordenesDelDia[0]);
                        }}>
                            <Text style={styles.textoMasOrdenes}>+{ordenesDelDia.length - 2} más</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <LinearGradient colors={colors.gradientePrimario} style={styles.container}>
            <View style={styles.tarjeta}>
                <TouchableOpacity style={styles.botonProgramar} onPress={alternarFormulario}>
                    <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
                    <Text style={styles.textoBotonProgramar}>Programar orden</Text>
                </TouchableOpacity>

                {mostrarFormulario && (
                    <Formulario
                        valores={ordenProgramada}
                        onChange={actualizarCampo}
                        onSubmit={guardarOrden}
                    />
                )}

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Encabezado con mes y año */}
                    <View style={styles.encabezado}>
                        <TouchableOpacity onPress={irMesAnterior} style={styles.botonNavegacion}>
                            <Ionicons name="chevron-back" size={22} color={colors.iluminado} />
                        </TouchableOpacity>

                        <Text style={styles.tituloMes}>
                            {MESES[mesActual]} {anioActual}
                        </Text>

                        <TouchableOpacity onPress={irMesSiguiente} style={styles.botonNavegacion}>
                            <Ionicons name="chevron-forward" size={22} color={colors.iluminado} />
                        </TouchableOpacity>
                    </View>

                    {/* Días de la semana */}
                    <View style={styles.fila}>
                        {DIAS_SEMANA.map((dia) => (
                            <View key={dia} style={styles.celda}>
                                <Text style={styles.textoDiaSemana}>{dia}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Grilla de días */}
                    <View style={styles.grilla}>
                        {celdas}
                    </View>

                    {/* Indicador del día seleccionado */}
                    {diaSeleccionado && (
                        <View style={styles.infoSeleccionado}>
                            <Ionicons name="calendar-outline" size={16} color={colors.variante1} />
                            <Text style={styles.textoInfoSeleccionado}>
                                {diaSeleccionado} de {MESES[mesActual]}, {anioActual}
                            </Text>
                        </View>
                    )}

                    {/* Lista de órdenes del día seleccionado */}
                    {diaSeleccionado && (() => {
                        const ordenesDelDiaSeleccionado = ordenes.filter(
                            (o) => o.dia === diaSeleccionado && o.mes === mesActual + 1 && o.anio === anioActual
                        );
                        if (ordenesDelDiaSeleccionado.length === 0) return null;
                        return (
                            <View style={styles.listaOrdenesDia}>
                                <Text style={styles.tituloListaOrdenes}>
                                    Órdenes del {diaSeleccionado} de {MESES[mesActual]}
                                </Text>
                                {ordenesDelDiaSeleccionado.map((orden) => (
                                    <TouchableOpacity
                                        key={orden.id}
                                        style={styles.itemOrdenLista}
                                        onPress={() => setOrdenSeleccionada(orden)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.itemOrdenIcono}>
                                            <Ionicons name="construct-outline" size={18} color="#10bfae" />
                                        </View>
                                        <View style={styles.itemOrdenInfo}>
                                            <Text style={styles.itemOrdenServicio}>{orden.servicio}</Text>
                                            <Text style={styles.itemOrdenSub}>
                                                {orden.horaInicio && orden.horaFin
                                                    ? `${orden.horaInicio} - ${orden.horaFin}`
                                                    : orden.horaInicio || 'Sin hora'}
                                                {orden.tecnico ? `  •  ${orden.tecnico}` : ''}
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={18} color="#b0b8c1" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        );
                    })()}
                </ScrollView>

                {/* Modal de detalle de orden */}
                <Modal
                    visible={ordenSeleccionada !== null}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setOrdenSeleccionada(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContenido}>
                            <View style={styles.modalEncabezado}>
                                <View style={styles.modalTituloContenedor}>
                                    <View style={styles.modalIconoTitulo}>
                                        <Ionicons name="document-text" size={20} color="#ffffff" />
                                    </View>
                                    <Text style={styles.modalTitulo}>Detalle de la orden</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setOrdenSeleccionada(null)}
                                    style={styles.modalBotonCerrar}
                                >
                                    <Ionicons name="close" size={22} color="#7a8694" />
                                </TouchableOpacity>
                            </View>

                            {ordenSeleccionada && (
                                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                                    {/* Servicio */}
                                    <View style={styles.detalleSeccion}>
                                        <View style={styles.detalleFila}>
                                            <Ionicons name="construct-outline" size={18} color="#10bfae" />
                                            <Text style={styles.detalleLabel}>Servicio</Text>
                                        </View>
                                        <Text style={styles.detalleValor}>{ordenSeleccionada.servicio}</Text>
                                    </View>

                                    {/* Fecha */}
                                    <View style={styles.detalleSeccion}>
                                        <View style={styles.detalleFila}>
                                            <Ionicons name="calendar-outline" size={18} color="#10bfae" />
                                            <Text style={styles.detalleLabel}>Fecha programada</Text>
                                        </View>
                                        <Text style={styles.detalleValor}>
                                            {ordenSeleccionada.dia}/{ordenSeleccionada.mes}/{ordenSeleccionada.anio}
                                        </Text>
                                    </View>

                                    {/* Horario */}
                                    <View style={styles.detalleSeccionDoble}>
                                        <View style={styles.detalleColumna}>
                                            <View style={styles.detalleFila}>
                                                <Ionicons name="time-outline" size={18} color="#10bfae" />
                                                <Text style={styles.detalleLabel}>Hora inicio</Text>
                                            </View>
                                            <Text style={styles.detalleValor}>
                                                {ordenSeleccionada.horaInicio || '—'}
                                            </Text>
                                        </View>
                                        <View style={styles.detalleColumna}>
                                            <View style={styles.detalleFila}>
                                                <Ionicons name="time-outline" size={18} color="#d15b75" />
                                                <Text style={styles.detalleLabel}>Hora fin</Text>
                                            </View>
                                            <Text style={styles.detalleValor}>
                                                {ordenSeleccionada.horaFin || '—'}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Técnico */}
                                    <View style={styles.detalleSeccion}>
                                        <View style={styles.detalleFila}>
                                            <Ionicons name="person-outline" size={18} color="#10bfae" />
                                            <Text style={styles.detalleLabel}>Técnico</Text>
                                        </View>
                                        <Text style={styles.detalleValor}>{ordenSeleccionada.tecnico}</Text>
                                    </View>

                                    {/* Cliente */}
                                    {ordenSeleccionada.cliente ? (
                                        <View style={styles.detalleSeccion}>
                                            <View style={styles.detalleFila}>
                                                <Ionicons name="people-outline" size={18} color="#10bfae" />
                                                <Text style={styles.detalleLabel}>Cliente</Text>
                                            </View>
                                            <Text style={styles.detalleValor}>{ordenSeleccionada.cliente}</Text>
                                        </View>
                                    ) : null}

                                    {/* Costo */}
                                    {ordenSeleccionada.costo ? (
                                        <View style={styles.detalleSeccion}>
                                            <View style={styles.detalleFila}>
                                                <Ionicons name="cash-outline" size={18} color="#10bfae" />
                                                <Text style={styles.detalleLabel}>Costo</Text>
                                            </View>
                                            <Text style={styles.detalleValorDestacado}>
                                                ${ordenSeleccionada.costo}
                                            </Text>
                                        </View>
                                    ) : null}

                                    {/* Descripción */}
                                    {ordenSeleccionada.descripcion ? (
                                        <View style={styles.detalleSeccion}>
                                            <View style={styles.detalleFila}>
                                                <Ionicons name="reader-outline" size={18} color="#10bfae" />
                                                <Text style={styles.detalleLabel}>Descripción</Text>
                                            </View>
                                            <Text style={styles.detalleValorDescripcion}>
                                                {ordenSeleccionada.descripcion}
                                            </Text>
                                        </View>
                                    ) : null}
                                </ScrollView>
                            )}

                            <TouchableOpacity
                                style={styles.modalBotonCerrarAbajo}
                                onPress={() => setOrdenSeleccionada(null)}
                            >
                                <Text style={styles.modalBotonCerrarTexto}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    tarjeta: {
        width: '100%',
        maxWidth: 1200,
        minHeight: '92%',
        backgroundColor: '#f7f8fa',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 14,
    },
    botonProgramar: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#10bfae',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    textoBotonProgramar: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 14,
    },
    encabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        paddingHorizontal: 4,
    },
    botonNavegacion: {
        backgroundColor: '#10bfae',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        elevation: 1,
    },
    tituloMes: {
        fontSize: 34,
        fontWeight: '500',
        color: '#8f949a',
        textTransform: 'lowercase',
    },
    fila: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 6,
        backgroundColor: '#eceff2',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingVertical: 8,
    },
    grilla: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderWidth: 1,
        borderColor: '#e7ebf0',
        overflow: 'hidden',
    },
    celda: {
        width: '14.28%',
        minHeight: 86,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f0f2f6',
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    textoDiaSemana: {
        fontSize: 16,
        fontWeight: '600',
        color: '#66707b',
        textTransform: 'lowercase',
    },
    textoDia: {
        fontSize: 18,
        fontWeight: '400',
        color: '#7a8694',
        marginBottom: 4,
    },
    celdaHoy: {
        backgroundColor: '#e6f8f5',
        borderRadius: 0,
    },
    textoHoy: {
        color: '#0f766e',
        fontWeight: 'bold',
    },
    celdaSeleccionada: {
        backgroundColor: '#10bfae',
        borderRadius: 0,
    },
    textoSeleccionado: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    contenedorTiritas: {
        width: '100%',
        gap: 3,
    },
    tiritaOrden: {
        backgroundColor: '#f7dbe0',
        borderLeftWidth: 3,
        borderLeftColor: '#d15b75',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    textoTirita: {
        color: '#5e3440',
        fontSize: 10,
        fontWeight: '600',
    },
    textoMasOrdenes: {
        color: '#6a7380',
        fontSize: 10,
        fontWeight: '600',
    },
    infoSeleccionado: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
        gap: 6,
        backgroundColor: '#e8f7f5',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    textoInfoSeleccionado: {
        color: '#116c64',
        fontSize: 15,
        fontWeight: '600',
    },
    // Estilos para la lista de órdenes del día
    listaOrdenesDia: {
        marginTop: 14,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e7ebf0',
        padding: 14,
    },
    tituloListaOrdenes: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2c3b4a',
        marginBottom: 12,
    },
    itemOrdenLista: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f8fa',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eef1f5',
    },
    itemOrdenIcono: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#e6f8f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemOrdenInfo: {
        flex: 1,
    },
    itemOrdenServicio: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2c3b4a',
    },
    itemOrdenSub: {
        fontSize: 12,
        color: '#7a8694',
        marginTop: 2,
    },
    // Estilos para el modal de detalle
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContenido: {
        width: '100%',
        maxWidth: 480,
        maxHeight: '85%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    modalEncabezado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eef1f5',
        backgroundColor: '#fafbfc',
    },
    modalTituloContenedor: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    modalIconoTitulo: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#10bfae',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitulo: {
        fontSize: 17,
        fontWeight: '700',
        color: '#2c3b4a',
    },
    modalBotonCerrar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f2f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 8,
    },
    detalleSeccion: {
        marginBottom: 16,
        backgroundColor: '#f7f8fa',
        borderRadius: 10,
        padding: 14,
        borderWidth: 1,
        borderColor: '#eef1f5',
    },
    detalleSeccionDoble: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    detalleColumna: {
        flex: 1,
        backgroundColor: '#f7f8fa',
        borderRadius: 10,
        padding: 14,
        borderWidth: 1,
        borderColor: '#eef1f5',
    },
    detalleFila: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    detalleLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7a8694',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detalleValor: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2c3b4a',
    },
    detalleValorDestacado: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f766e',
    },
    detalleValorDescripcion: {
        fontSize: 14,
        fontWeight: '400',
        color: '#4a5568',
        lineHeight: 20,
    },
    modalBotonCerrarAbajo: {
        marginHorizontal: 18,
        marginBottom: 16,
        marginTop: 8,
        backgroundColor: '#10bfae',
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
    },
    modalBotonCerrarTexto: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default Calendario;
