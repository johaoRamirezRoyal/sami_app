import { Button } from "react-native-paper";
import { Text, View } from 'react-native';
import { styles } from "../../styles/prueba/pruebaStyles";
import { StatusBar } from 'expo-status-bar';


//La función de la carpeta de componentes es tener un componente por cada pantalla o cada función que tenga que hacer
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <StatusBar style="auto" />
      <Button 
        
        mode="contained"
        onPress={() => navigation.navigate('Settings')} 
        > 
        Go to Settings
      </Button>
      <Button 
        
        mode="contained"
        onPress={() => navigation.navigate('Johao')}
      >
        Go to Help Screen
      </Button>
    </View>
  );
}