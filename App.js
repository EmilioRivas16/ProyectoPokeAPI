import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ProgressViewIOSBase, ScrollView } from 'react-native';
import { reqAPI, wait3SecondsAsync } from './importPromise';
import { useState, useEffect } from 'react';

export default function App() {

  const [ cargando, setCargando ] = useState('Cargando...');
  const [ pokemon, setPokemon ] = useState();

  const [ name, setPokemonName ] = useState();
  const [ types, setPokemonType ] = useState();
  const [ description, setPokemonDescription ] = useState();

  const waitPlease = async (showResolve) => {
    try {
      const result = await wait3SecondsAsync(showResolve);
      setCargando(`${result}`);


    } catch (error) {
      setCargando(`catch: ${error}`);
    }

    try {
      
      const { data: {name, types}} = await reqAPI.get("/pokemon/ditto");
      setPokemonName(name);
      const tipos = types;
      

      // Desestructurando types

      const [{ type: { name: nombreDelTipo } }] = tipos;

      setPokemonType(nombreDelTipo)

      /*
      const types = 
      [
        {
          "slot":1,
          "type": {
            "name": "grass",
            "url": "https://pokeapi.co/api/type/1/"
          }
        },
        {
          "slot":2,
          "type"; {
            "name": "poison",
            "url": "https://pokeapi.co/api/type/12/"
          }
        }
      ]
      */

      /*

      "flavor_text_entries": [
    {
      "text": "this is in english",
      "language": {
        "name": "en"
      }
    },
    {
      "text": "Esto está en español",
      "language": {
        "name": "es",
      }
    },
    {
      "text": "Estou estau eun francois",
      "language": {
        "name": "fr",
      }
    }

      */





      const { data: {flavor_text_entries}} = await reqAPI.get("/pokemon-species/ditto");

      //setPokemonDescription(flavor_text_entries);

      const todaslasdescripciones = flavor_text_entries

      const text  = todaslasdescripciones.find(entry => entry.language.name === "es");

      const { flavor_text } = text;

      setPokemonDescription(flavor_text);


      
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
            {"\n\n\n"}
            {cargando}
        </Text>
       
        <TextInput placeholder="Ingrese el ID o nombre del Pokemon"/>
        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
            {JSON.stringify(name, null, 2)}
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          {JSON.stringify(types, null, 2)}
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          {JSON.stringify(description, null, 2)}
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
        Tipos a los que NO le hace daño,{"\n"}
        Tipos a los que hace la mitad de daño,{"\n"}
        Tipos a los que les hace el doble de daño,{"\n"}
        Tipos a los que recibe el doble de daño,
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
        Posibles movimientos (Ataques) {"\n"}
        ordenados alfabéticamente {"\n"}
        (Flamethrower, Ice Beam, etc...).
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
            Cadena evolutiva (si aplica)
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