
import { Button } from "react-native-paper";
import { Text, View } from 'react-native';
import { styles } from "../../styles/prueba/pruebaStyles";
import { StatusBar } from 'expo-status-bar';
import HelpScreen from "../../pages/helpScreen";


//La función de la carpeta de componentes es tener un componente por cada pantalla o cada función que tenga que hacer
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <StatusBar style="auto" />
      <Button
        style={styles.button}
        labelStyle={styles.buttonLabel}
        mode="contained"
        onPress={() => navigation.navigate('Settings')}
      >
        Go to Settings
      </Button>
      <Button
        style={styles.button}
        labelStyle={styles.buttonLabel}
        mode="contained"
        onPress={() => navigation.navigate('JOSE')}
      >
        Go to Help Screen
      </Button>
    </View>
  );
}