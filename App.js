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

  let nombreOnumero = "42";

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

      //COMO HAY VARIOS TIPOS USO LA FUNCIÓN MAP() PARA GUARDARLOS EN UN ARREGLO Y LUEGO CONVERTIRLOS A STRING
      const tiposenarreglo = types.map(tipos =>tipos.type.name)
      tipos = tiposenarreglo.toString();
      setPokemonType(tipos)

      const urltiposenarreglo = types.map(tipos =>tipos.type.url) //arreglo con las urls de los tipos

      //DESESTRUCTURANDO DAÑOS

      //Declaración de arreglos vacios donde se guardaran los daños
      var arreglodetiposNHD = [];
      var arreglodetiposRDDD = [];
      var arreglodetiposHDDD = [];
      var arreglodetiposHMDD = [];

      // En este ciclo for se recibe y procesa cada URL de los tipos que sea el pokemon
      for (let i = 0; i < urltiposenarreglo.length; i++) {

        const urlDelTipo = urltiposenarreglo[i];

        const { data: {damage_relations: {double_damage_from,double_damage_to,half_damage_to,no_damage_to}}} = await reqAPI.get(urlDelTipo);
        
        const NoLeHaceDaño = no_damage_to.map(ndt =>ndt.name)
        nhd = NoLeHaceDaño.toString();
        arreglodetiposNHD.push(nhd);

        const RecibeDobleDeDañoDe = double_damage_from.map(ddf =>ddf.name)
        rddd = RecibeDobleDeDañoDe.toString();
        arreglodetiposRDDD.push(rddd);

        const HaceElDobleDeDaño = double_damage_to.map(ddt =>ddt.name)
        hddd = HaceElDobleDeDaño.toString();
        arreglodetiposHDDD.push(hddd);

        const HaceLaMitadDeDaño = half_damage_to.map(hdt =>hdt.name)
        hmdd = HaceLaMitadDeDaño.toString();
        arreglodetiposHMDD.push(hmdd);

      }

      
      let filteredarreglodetiposHMDD = arreglodetiposHMDD.filter(elm => elm); //Eliminando elementos vacios del arreglo (en caso de que hayan)
      let stringHMDD = filteredarreglodetiposHMDD.toString() //Convirtiendo el arreglo a String
      stringHMDD = Array.from(new Set(stringHMDD.split(','))).toString(); //Eliminando elementos duplicados (en caso de que haya alguno)

      let filteredarreglodetiposHDDD = arreglodetiposHDDD.filter(elm => elm); //Eliminando elementos vacios del arreglo (en caso de que hayan)
      let stringHDDD = filteredarreglodetiposHDDD.toString() //Convirtiendo el arreglo a String
      stringHDDD = Array.from(new Set(stringHDDD.split(','))).toString(); //Eliminando elementos duplicados (en caso de que haya alguno)

      let filteredarreglodetiposRDDD = arreglodetiposRDDD.filter(elm => elm); //Eliminando elementos vacios del arreglo (en caso de que hayan)
      let stringRDDD = filteredarreglodetiposRDDD.toString() //Convirtiendo el arreglo a String
      stringRDDD = Array.from(new Set(stringRDDD.split(','))).toString();  //Eliminando elementos duplicados (en caso de que haya alguno)

      let filteredarreglodetiposNHD = arreglodetiposNHD.filter(elm => elm); //Eliminando elementos vacios del arreglo (en caso de que hayan)
      let stringNHD = filteredarreglodetiposNHD.toString() //Convirtiendo el arreglo a String
      stringNHD = Array.from(new Set(stringNHD.split(','))).toString(); //Eliminando elementos duplicados (en caso de que haya alguno)

      setMakeHalfDamage(stringHMDD)
      setMakeDoubleDamage(stringHDDD)
      setRecieveDoubleDamage(stringRDDD)
      setNoMakeDamage(stringNHD);





      
      //DESESTRUCTURANDO LA DESCRIPCIÓN
      const { data: {flavor_text_entries}} = await reqAPI.get(`/pokemon-species/${nombreOnumero}`);
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
        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
            Nombre: {JSON.stringify(name, null, 2)}
        </Text>

        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          Tipos:{JSON.stringify(types, null, 2)}
        </Text>

        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          Descripción: {JSON.stringify(description, null, 2)}
        </Text>

        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
        No le hace daño a: {"\n"}{JSON.stringify(NoMakeDamage, null, 2)}{"\n\n"}
        Le hace la mitad de daño a: {"\n"}{JSON.stringify(MakeHalfDamage, null, 2)}{"\n\n"}
        Le hace el doble de daño a: {"\n"}{JSON.stringify(MakeDoubleDamage, null, 2)}{"\n\n"}
        Recibe el doble de daño de: {"\n"}{JSON.stringify(RecieveDoubleDamage, null, 2)}
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