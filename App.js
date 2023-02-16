import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ProgressViewIOSBase, ScrollView } from 'react-native';
import { reqAPI, wait3SecondsAsync } from './importPromise';
import { useState, useEffect } from 'react';

export default function App() {

  const [ cargando, setCargando ] = useState('Cargando...');
  const [ pokemon, setPokemon ] = useState();

  const waitPlease = async (showResolve) => {
    try {
      const result = await wait3SecondsAsync(showResolve);
      setCargando(`${result}`);
    } catch (error) {
      setCargando(`catch: ${error}`);
    }

    try {
      
      const PokemonDelAPI = await reqAPI.get("/ditto");
      setPokemon(PokemonDelAPI);
      
    } catch (error) {
      const { message } = error;
      setPokemon(message);
    }
  };

  useEffect(() => {
    waitPlease(true);
  },[]);
  return (
      <View style={styles.container}>
        
        <Text style={styles.sectionContainer}>
              {cargando}
            </Text>

            <Text style={styles.sectionContainer}>
              {JSON.stringify(pokemon, null, 2)}
            </Text>
        
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
