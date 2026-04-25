import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Formulario({
    valores,
    onChange,
    onSubmit,
}) {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Programar orden</Text>

            <Text style={styles.label}>Día a programar</Text>
            <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                value={valores.fechaProgramada}
                onChangeText={(texto) => onChange("fechaProgramada", texto)}
            />

            <Text style={styles.label}>Servicio</Text>
            <TextInput
                style={styles.input}
                placeholder="Servicio a realizar"
                value={valores.servicio}
                onChangeText={(texto) => onChange("servicio", texto)}
            />

            <Text style={styles.label}>Nombre del técnico</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre del técnico"
                value={valores.tecnico}
                onChangeText={(texto) => onChange("tecnico", texto)}
            />

            <Text style={styles.label}>Costo</Text>
            <TextInput
                style={styles.input}
                placeholder="Costo estimado"
                value={valores.costo}
                keyboardType="numeric"
                onChangeText={(texto) => onChange("costo", texto)}
            />

            <View style={styles.filaHoras}>
                <View style={styles.columnaHora}>
                    <Text style={styles.label}>Hora de inicio</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="08:00"
                        value={valores.horaInicio}
                        onChangeText={(texto) => onChange("horaInicio", texto)}
                    />
                </View>
                <View style={styles.columnaHora}>
                    <Text style={styles.label}>Hora de fin</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="10:00"
                        value={valores.horaFin}
                        onChangeText={(texto) => onChange("horaFin", texto)}
                    />
                </View>
            </View>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                style={[styles.input, styles.inputMultilinea]}
                placeholder="Detalles de la orden"
                value={valores.descripcion}
                multiline
                numberOfLines={4}
                onChangeText={(texto) => onChange("descripcion", texto)}
            />

            <Text style={styles.label}>Cliente</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre del cliente"
                value={valores.cliente}
                onChangeText={(texto) => onChange("cliente", texto)}
            />

            <TouchableOpacity style={styles.botonGuardar} onPress={onSubmit}>
                <Text style={styles.textoBotonGuardar}>Guardar orden</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        marginBottom: 16,
        padding: 14,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e7ebf0",
    },
    titulo: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2c3b4a",
        marginBottom: 10,
    },
    label: {
        fontSize: 13,
        color: "#5f6b78",
        marginBottom: 6,
        marginTop: 6,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#d9e0e8",
        borderRadius: 8,
        backgroundColor: "#f9fbfd",
        paddingHorizontal: 10,
        paddingVertical: 9,
        fontSize: 14,
        color: "#2c3b4a",
    },
    filaHoras: {
        flexDirection: "row",
        gap: 10,
    },
    columnaHora: {
        flex: 1,
    },
    inputMultilinea: {
        minHeight: 90,
        textAlignVertical: "top",
    },
    botonGuardar: {
        marginTop: 14,
        backgroundColor: "#10bfae",
        borderRadius: 8,
        paddingVertical: 11,
        alignItems: "center",
    },
    textoBotonGuardar: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },
});