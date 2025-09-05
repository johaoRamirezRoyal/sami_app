import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './components/prueba/homeScreen';
import SettingsScreen from './components/prueba/settingsScreen';
import Prueba from './pages/prueba';
import HelpScreen from './pages/helpScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* MAL ERROR DE ARQUITECTURA */}
        <Stack.Screen name="Login" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        {/* --------------------------------------------------- */}
        <Stack.Screen name="Johao" component={HelpScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
