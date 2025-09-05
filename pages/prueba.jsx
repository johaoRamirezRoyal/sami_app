import { View } from "react-native";
import { styles } from "../styles/prueba/pruebaStyles";
import { Text } from "react-native-paper";



//El objetivo de la carpeta de Pages es tener una página para juntar los distintos componentes que puede llegar a tener
export default function Prueba() {
  return (
    <View style={styles.container}>
      <Text>Prueba</Text>
    </View>
  );
}