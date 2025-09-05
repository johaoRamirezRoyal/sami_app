import { Button } from "react-native-paper";
import { styles } from "../../styles/prueba/pruebaStyles";
import { Text, View } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
      <Button 
        icon="home-outline"
        mode="contained"
        onPress={() => navigation.navigate('Login')
        }
      >
        Go to Home
      </Button>
    </View>
  );
}