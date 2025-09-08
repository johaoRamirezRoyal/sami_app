import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  inputIcon: {
    fontSize: 20,
    color: '#666',
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
});

// Ejemplo de uso en un input dentro de HomeScreen:
// <View style={loginStyles.inputContainer}>
//   <Icon name="user" style={loginStyles.inputIcon} />
//   <TextInput style={loginStyles.input} placeholder="Usuario" />
// </View>