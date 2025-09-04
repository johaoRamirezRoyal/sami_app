import { Button } from "react-native-paper";
import { Text, View } from 'react-native';
import { styles } from "../../styles/prueba/pruebaStyles";
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <StatusBar style="auto" />
      <Button 
        icon="settings-outline"
        mode="contained"
        onPress={() => navigation.navigate('Settings')} 
        > 
        Go to Settings
      </Button>
    </View>
  );
}