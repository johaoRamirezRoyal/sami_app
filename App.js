import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';


import login_s from './pages/login/login_Sami';
import Inicio from './pages/inicio/inicio';
import llegadas_tarde from './pages/llegadas_tardes/asistencia';
import HelpNav from './pages/help/helpNavegation';
import CamerScreen from './pages/camera/camerScreen';
import Reserve from './pages/reserve/reserve';
import inventario from './pages/lis.Inventario/lis.Inventario';
import SplashScreen from './pages/login/cargalogin';
import PerfilScreen from './pages/perfil/perfil'; // Importa tu pantalla de perfil aquí
import BarraNav from './components/nav/barra_nav';

const Stack = createNativeStackNavigator();


// Función reutilizable para las opciones del header con logo y back
function   getLogoHeaderOptions(extraOptions = {}) {
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
      <Stack.Navigator initialRouteName="carga">
        <Stack.Screen 
          name="carga" 
          component={SplashScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={login_s} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="inicio" 
          component={Inicio} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="JOSE" 
          component={HelpNav} 
          options={getLogoHeaderOptions()} 
        />
        <Stack.Screen 
          name="llegadas_tarde" 
          component={llegadas_tarde} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CamerScreen}
          options={getLogoHeaderOptions()} 
        />
        <Stack.Screen 
          name="reserve" 
          component={Reserve}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="inventario" 
          component={inventario} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="perfil" 
          component={PerfilScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
