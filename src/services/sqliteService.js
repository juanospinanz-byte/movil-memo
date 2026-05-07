import { Platform } from 'react-native'

let db = null

if (Platform.OS !== 'web') {
  const SQLite = require('expo-sqlite')
  db = SQLite.openDatabaseSync('nombre_de_su_base_de_datos')
}

// Dentro de este archivo irán las sentencias y queries sql

const init = () => {
  if (!db) {
    console.warn('SQLite no disponible en web. Use un almacenamiento alternativo.')
    return
  }
  
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS ordenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        dia INTEGER,
        mes INTEGER,
        anio INTEGER,
        servicio TEXT,
        tecnico TEXT,
        horaInicio TEXT,
        horaFin TEXT,
        costo TEXT,
        descripcion TEXT,
        cliente TEXT,
        fechaProgramada TEXT
      );
      CREATE TABLE IF NOT EXISTS plagas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        tratamiento TEXT
      );
    `);
    console.log('Tablas inicializadas correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}

const guardarOrden = (orden, userId) => {
  if (!db) {
    console.warn('SQLite no disponible en web.');
    return null;
  }
  try {
    const result = db.runSync(
      `INSERT INTO ordenes (user_id, dia, mes, anio, servicio, tecnico, horaInicio, horaFin, costo, descripcion, cliente, fechaProgramada)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, orden.dia, orden.mes, orden.anio, orden.servicio, orden.tecnico, orden.horaInicio, orden.horaFin, orden.costo, orden.descripcion, orden.cliente, orden.fechaProgramada]
    );
    return { ...orden, id: result.lastInsertRowId };
  } catch (error) {
    console.error('Error guardando orden:', error);
    return null;
  }
}

const obtenerOrdenesPorUsuario = (userId) => {
  if (!db) {
    console.warn('SQLite no disponible en web.');
    return [];
  }
  try {
    const result = db.getAllSync('SELECT * FROM ordenes WHERE user_id = ?', [userId]);
    return result;
  } catch (error) {
    console.error('Error obteniendo ordenes:', error);
    return [];
  }
}

const actualizarGasolina = () => {
  if (!db) {
    console.warn('SQLite no disponible en web. La actualización de gasolina no se ejecuta.')
    return null
  }

  const result = db.runSync(
    //CONSULTA SQL PARA UPDATE
  )

  return result
}

const guardarPlaga = (plaga, userId) => {
  if (!db) {
    console.warn('SQLite no disponible en web.');
    return null;
  }
  try {
    const result = db.runSync(
      `INSERT INTO plagas (user_id, nombre, descripcion, tratamiento)
       VALUES (?, ?, ?, ?)`,
      [userId, plaga.nombre, plaga.descripcion, plaga.tratamiento]
    );
    return { ...plaga, id: result.lastInsertRowId };
  } catch (error) {
    console.error('Error guardando plaga:', error);
    return null;
  }
}

const obtenerPlagasPorUsuario = (userId) => {
  if (!db) {
    console.warn('SQLite no disponible en web.');
    return [];
  }
  try {
    const result = db.getAllSync('SELECT * FROM plagas WHERE user_id = ?', [userId]);
    return result;
  } catch (error) {
    console.error('Error obteniendo plagas:', error);
    return [];
  }
}

export default {
  init,
  actualizarGasolina,
  guardarOrden,
  obtenerOrdenesPorUsuario,
  guardarPlaga,
  obtenerPlagasPorUsuario
}
