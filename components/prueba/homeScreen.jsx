import React, { useState } from "react";
import { 
  View, 
  Text, 
  ImageBackground, 
  Image, 
  Animated, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { Button, Card, TextInput } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';

import { styles } from "../../styles/prueba/pruebaStyles";
import fondo from '../../assets/fondo.jpg';
import logo from '../../assets/logo.jpg';
import { guardarSesion, obtenerSesion, login } from "../sesion/sesion";

export default function HomeScreen({ navigation }) {
  // Estados
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Maneja el login
  const handleLogin = () => {
    setError('');
    if (username.trim().length < 4) {
      setError('El usuario debe tener al menos 4 caracteres.');
      return;
    }
    if (password.trim().length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setLoading(true);

    const URL = "http://192.168.0.105:3000/api/usuarios/login";
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario: username, contraseña: password })
    })
      .then(response => response.json())
      .then(async data => {
        
        setLoading(false);
        if (data && data.token) {
          setError('');
          // Guarda la sesión aquí
          await guardarSesion(data.usuario, data.token);
          navigation.navigate('Settings');
        } else {
          setError(data.token || 'Error al iniciar sesión');
        }
      })
      .catch(error => {
        setLoading(false);
        setError('No se pudo conectar al servidor');
        console.error('Error en login:', error);
      });
  };

  console.log('Enviando:', { username, password });

  return (
    <View style={{ flex: 1 }}>
      {/* Fondo */}
      <ImageBackground 
        source={fondo} 
        style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }} 
        resizeMode="cover" 
      />

      {/* Contenido principal con KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center' }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Card style={{ backgroundColor: 'rgba(255, 255, 255, 1)', margin: 20, padding: 20, borderRadius: 100 }}>
          <Card.Content>
            {/* Logo y título */}
            <Image 
              source={logo} 
              style={{ width: 200, height: 200, alignSelf: 'center', marginBottom: 20, borderRadius: 100 }} 
            />
            <Text style={[styles.title, { alignSelf: 'center', marginBottom: 2 }]}>S.A.M.I app</Text>
            <Text style={{ color: 'gray', alignSelf: 'center', marginBottom: 20, fontSize: 16 }}>
              sign in to continue
            </Text>
            <StatusBar style="auto" />

            {/* Usuario */}
            <TextInput
              label="User Name"
              value={username}
              onChangeText={setUsername}
              style={styles.textInput}
              mode="outlined"
              autoCapitalize="none"
              left={<TextInput.Icon icon="account" color={userFocus ? "#004989" : "#888"} />}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              theme={{
                colors: {
                  primary: '#004989',
                  text: '#c2c2c2ff',
                  placeholder: '#888'
                },
                roundness: 60
              }}
            />

            {/* Contraseña */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.textInput}
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="shield-lock" color={passFocus ? "#004989" : "#888"} />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  color={passFocus ? "#004989" : "#888"}
                  onPress={() => setShowPassword(!showPassword)}
                  forceTextInputFocus={false}
                />
              }
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              theme={{
                colors: {
                  primary: '#004989',
                  text: '#c2c2c2ff',
                  placeholder: '#888'
                },
                roundness: 60
              }}
            />

            {/* Mensaje de error */}
            {error ? (
              <Text style={{ color: 'red', alignSelf: 'center', marginTop: 8, marginBottom: 4 }}>
                {error}
              </Text>
            ) : null}

            {/* Botón Ingresar */}
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  (loading || username.trim().length < 4 || password.trim().length < 8) && styles.buttonDisabled,
                  { marginTop: 8 }
                ]}
                onPress={handleLogin}
                disabled={loading || username.trim().length < 4 || password.trim().length < 8}
                accessibilityLabel="Botón para iniciar sesión"
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonLabel}>Ingresar</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Enlace de ayuda */}
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
      </KeyboardAvoidingView>
    </View>
  );
}