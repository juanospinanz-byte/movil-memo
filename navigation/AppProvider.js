import { useEffect, useState } from "react"
import sqliteService from '../src/services/sqliteService';
import { ActivityIndicator, View } from "react-native";
import { ThemeProvider } from '../src/constants/ThemeContext';

const AppProvider = ({children}) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        const init = async () => {
            try {
                await sqliteService.init();
            } catch (e) {
                console.warn('Mensaje con el error');
            } finally {
                if (mounted) setReady(true);
            }
        }
        init();
        return () => { mounted = false }
    }, []);

    if (!ready) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}

export default AppProvider