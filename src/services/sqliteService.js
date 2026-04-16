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
  // Logica para arrancar la bd
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

export default {
  init,
  actualizarGasolina,
}
