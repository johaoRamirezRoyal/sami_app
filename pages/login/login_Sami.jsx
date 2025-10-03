import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ImageBackground, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator 
} from 'react-native';
import { Button, Card, TextInput } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import { styles } from "../../styles/login/logiStyle";
import fondo from '../../assets/fondo.jpg';
import { guardarSesion, obtenerSesion, login } from "../../components/sesion/sesion";
import { BASE_URL } from "../../components/api/urlApi";

// Componente principal de Login
export default function Login_s ({ navigation }) {
  const navigate = useNavigation();

  useEffect(() => {
    // Si hay sesión, redirige al dashboard o página principal
    // Elimina el uso de localStorage aquí
    // Puedes agregar lógica alternativa si lo necesitas
  }, [navigate]);

  // Estados para los campos y la UI
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Función para manejar el login
  const handleLogin = () => {
    setError('');
    // Validación básica de usuario y contraseña
    if (username.trim().length < 4) {
      setError('El usuario debe tener al menos 4 caracteres.');
      return;
    }
    if (password.trim().length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setLoading(true);

    // Llamada a la API para login
    const URL = `${BASE_URL}/usuarios/login`;
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
          // Guarda la sesión si el login es exitoso
          await guardarSesion(data.usuario, data.token);
          navigation.navigate('inicio');
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

  return (
    <View style={{ flex: 1 }}>
      {/* Fondo de pantalla */}
      <ImageBackground 
        source={fondo} 
        style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }} 
        resizeMode="cover" 
      />

      {/* Contenedor principal con manejo de teclado */}
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center' }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 10}
      >
        <Card style={styles.card}>
          <Card.Content>

            {/* Título y subtítulo */}
            <Text style={[styles.title, { marginTop: 50, fontSize:27 }]}>Bienvenido a S.A.M.I app</Text>
            <Text style={{ color: '#004989', alignSelf: 'center', marginBottom: 0, fontSize: 14, fontWeight: '600' }}>
              Sistema de Administración y Manejo Institucional.
            </Text>
            <Text style={{ color: '#004989', alignSelf: 'center', marginBottom: 35, fontSize: 15 }}>
              La plataforma del Colegio Real Royal School que integra y asegura la gestión académica, administrativa y operativa.
            </Text>
            <StatusBar style="auto" />

            {/* Inputs */}
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
                  text: '#004989',
                  placeholder: '#888'
                },
                roundness: 24
              }}
            />

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
                  text: '#004989',
                  placeholder: '#888'
                },
                roundness: 24
              }}
            />

            {/* Error */}
            {error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            {/* Botón */}
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

            {/* Ayuda */}
            <TouchableOpacity onPress={() => navigation.navigate('JOSE')} activeOpacity={0.7}>
              <Text style={styles.helpText}>
                ¿Necesitas ayuda?
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
    </View>
  );
}