import { registerRootComponent } from 'expo';
import { Provider as PaperProvider } from 'react-native-paper';

// Usa MaterialCommunityIcons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import App from './App';


// Creamos un wrapper para App con PaperProvider
function Main() {
  return (
    <PaperProvider
        settings={{
            icon: (props) => <MaterialCommunityIcons {...props} />
        }}
    >
      <App />
    </PaperProvider>
  );
}

// Esto se encarga de registrar el componente en Expo
registerRootComponent(Main);
