import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './colors';

const ThemeContext = createContext({
    isDarkMode: false,
    toggleTheme: () => {},
    theme: lightTheme,
});

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Cargar preferencia guardada al iniciar
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const saved = await AsyncStorage.getItem('@theme_mode');
                if (saved === 'dark') setIsDarkMode(true);
            } catch (e) {
                // Si falla, usamos el tema claro por defecto
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const next = !isDarkMode;
        setIsDarkMode(next);
        try {
            await AsyncStorage.setItem('@theme_mode', next ? 'dark' : 'light');
        } catch (e) {
            // Ignorar errores de almacenamiento
        }
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
