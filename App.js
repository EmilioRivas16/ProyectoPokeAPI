import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ProgressViewIOSBase, ScrollView } from 'react-native';
import { reqAPI, wait3SecondsAsync } from './importPromise';
import { useState, useEffect } from 'react';

export default function App() {

  const [ cargando, setCargando ] = useState('Cargando...');

  const [ name, setPokemonName ] = useState();
  const [ types, setPokemonType ] = useState();
  const [ description, setPokemonDescription ] = useState();

  const [ NoMakeDamage, setNoMakeDamage ] = useState();
  const [ MakeHalfDamage, setMakeHalfDamage ] = useState();
  const [ MakeDoubleDamage, setMakeDoubleDamage ] = useState();
  const [ RecieveDoubleDamage, setRecieveDoubleDamage ] = useState();

  let nombreOnumero = "13";

  const waitPlease = async (showResolve) => {
    try {
      const result = await wait3SecondsAsync(showResolve);
      setCargando(`${result}`);


    } catch (error) {
      setCargando(`catch: ${error}`);
    }

    try {
      
      //DESESTRUCTURANDO NOMBRE Y TIPO
      const { data: {name, types}} = await reqAPI.get(`/pokemon/${nombreOnumero}`);
      setPokemonName(name);
      const tipos = types;
      //setPokemonType(types) //Imprime TODO
      const [{ type: { name: nombreDelTipo } }] = tipos;
      setPokemonType(nombreDelTipo)



      //DESESTRUCTURANDO LA DESCRIPCIÓN
      const { data: {flavor_text_entries}} = await reqAPI.get(`/pokemon-species/${nombreOnumero}`);
      const todaslasdescripciones = flavor_text_entries
      const text  = todaslasdescripciones.find(entry => entry.language.name === "es");
      const { flavor_text } = text;
      setPokemonDescription(flavor_text);


      //DESESTRUCTURANDO DAÑOS
      const { data: {damage_relations: {double_damage_from, double_damage_to, half_damage_to, no_damage_to}}} = await reqAPI.get(`/type/${nombreOnumero}`);
      //setRecieveDoubleDamage(double_damage_from); //Imprime TODO
      const [{ name: RecibeDobleDeDañoDe }] = double_damage_from;
      setRecieveDoubleDamage(RecibeDobleDeDañoDe);

      const [{ name: HaceElDobleDeDaño }] = double_damage_to;
      setMakeDoubleDamage(HaceElDobleDeDaño);

      const [{ name: HaceLaMitadDeDaño }] = half_damage_to;
      setMakeHalfDamage(HaceLaMitadDeDaño);

      const [{ name: NoLeHaceDaño }] = no_damage_to;
      setNoMakeDamage(NoLeHaceDaño);

      
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
            Nombre: {JSON.stringify(name, null, 2)}
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          Tipos (de momento solo muestra uno):{JSON.stringify(types, null, 2)}
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          Descripción: {JSON.stringify(description, null, 2)}
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
        No le hace daño a: {JSON.stringify(NoMakeDamage, null, 2)}{"\n"}
        Le hace la mitad de daño a: {JSON.stringify(MakeHalfDamage, null, 2)}{"\n"}
        Le hace el doble de daño a: {JSON.stringify(MakeDoubleDamage, null, 2)}{"\n"}
        Recibe el doble de daño de: {JSON.stringify(RecieveDoubleDamage, null, 2)}
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