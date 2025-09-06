
import { Button, Card, TextInput } from "react-native-paper";
import { Text, View, ImageBackground, Image, Animated, TouchableOpacity } from 'react-native';
import { styles } from "../../styles/prueba/pruebaStyles";
import { StatusBar } from 'expo-status-bar';
import fondo from '../../assets/fondo.jpg';
import logo from '../../assets/logo.jpg';
import HelpScreen from "../../pages/helpScreen";


//La función de la carpeta de componentes es tener un componente por cada pantalla o cada función que tenga que hacer
import React, { useState } from "react";

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={fondo} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }} resizeMode="cover" />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card style={{ backgroundColor: 'rgba(255, 255, 255, 1)', margin: 20, padding: 60, borderRadius: 120 }}>
          <Card.Content>
            <Image source={logo} style={{ width: 200, height: 200, alignSelf: 'center', marginBottom: 20, borderRadius: 100 }} />
            <Text style={[styles.title, { alignSelf: 'center', marginBottom: 2 }]}>S.A.M.I app</Text>
            <Text style={{ color: 'gray', alignSelf: 'center', marginTop: 0, marginBottom: 20, fontSize: 16 }}>sign in to continue</Text>
            <StatusBar style="auto" />

            {/* Formulario de usuario y contraseña */}
            <TextInput
              label="Usuario"
              value={username}
              onChangeText={setUsername}
              style={{ marginBottom: 12 }}
              mode="outlined"
              autoCapitalize="none"
            />
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              style={{ marginBottom: 20 }}
              mode="outlined"
              secureTextEntry
            />

            <Button
              style={styles.button}
              labelStyle={styles.buttonLabel}
              mode="contained"
              onPress={() => navigation.navigate('Settings')}
            >
              Go to Settings
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate('JOSE')} activeOpacity={0.7}>
              <Animated.Text style={{
                alignSelf: 'center',
                color: '#afafafff',
                fontSize: 18,
                marginTop: 24,
                opacity: 1,
                textDecorationLine: 'underline'
              }}>
                ¿Necesitas ayuda?
              </Animated.Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}