import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';


import HomeScreen from './components/prueba/homeScreen';
import SettingsScreen from './components/prueba/settingsScreen';
import Prueba from './pages/prueba';
import HelpScreen from './pages/helpScreen';
import HelpNav from './pages/helpNavegation';
import CamerScreen from './components/prueba/camerScreen';


const Stack = createNativeStackNavigator();


// Función reutilizable para las opciones del header con logo y back
function getLogoHeaderOptions(extraOptions = {}) {
  return ({ navigation }) => ({
    headerTitle: () => (
      <Image
        source={require('./assets/logoroyal.png')}
        style={{ width: 40, height: 40, resizeMode: 'contain' }}
      />
    ),
    headerTitleAlign: 'center',
    headerLeft: () => (
      <MaterialCommunityIcons
        name="account-arrow-left"
        size={35}
        style={{ marginLeft: 15 }}
        onPress={() => navigation.goBack()}
      />
    ),
    ...extraOptions,
  });
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="JOSE" 
          component={HelpNav} 
          options={getLogoHeaderOptions()} 
        />
        <Stack.Screen 
          name="Prueba" 
          component={Prueba} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CamerScreen}
          options={getLogoHeaderOptions()} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
