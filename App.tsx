import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { reqAPI, wait2SecondsAsync } from './importPromise';

export default function App() {
  const [cargando, setCargando] = useState('');
  const [text, setText] = useState('');

  const [name, setPokemonName] = useState<string | undefined>();
  const [types, setPokemonType] = useState<string | undefined>();
  const [description, setPokemonDescription] = useState<string | undefined>();

  const [NoMakeDamage, setNoMakeDamage] = useState<string | undefined>();
  const [MakeHalfDamage, setMakeHalfDamage] = useState<string | undefined>();
  const [MakeDoubleDamage, setMakeDoubleDamage] = useState<string | undefined>();
  const [RecieveDoubleDamage, setRecieveDoubleDamage] = useState<string | undefined>();

  const [moves, setMoves] = useState<string | undefined>();
  const [evolution, setEvolution] = useState<string | undefined>();

  let nombreOnumero = text.trim().toLowerCase(); //trim() elimina espacios en blanco y toLowerCase() vuelve todo minuscula

  const waitPlease = async (showResolve:any) => {
    try {

      setCargando('Cargando...'); // Actualizar el estado de cargando al darle enter
      const result = await wait2SecondsAsync(showResolve); //Esperando 2 segundos a que cargen los datos
      setCargando(''); //Cuando llegan los datos quitamos el texto de cargando

      //NOMBRE,TIPO y ATAQUES
      const { data: {name, types, moves}} = await reqAPI.get(`/pokemon/${nombreOnumero}`);
      setPokemonName(name);

      //COMO HAY VARIOS TIPOS USO LA FUNCIÓN MAP() PARA GUARDARLOS EN UN ARREGLO Y LUEGO CONVERTIRLOS A STRING
      const tiposenarreglo = types.map((tipos: any) => tipos.type.name);
      const tipos = tiposenarreglo.toString();
      setPokemonType(tipos);

      // MOVES
      const movesenarreglo = moves.map((movimientos: any) => movimientos.move.name);
      movesenarreglo.sort();
      const movimientos = movesenarreglo.toString();
      setMoves(movimientos);

      const urltiposenarreglo = types.map((tipos: any) => tipos.type.url); //arreglo con las urls de los tipos

      // DAÑOS

      //Declaración de arreglos vacios donde se guardaran los daños
      var arreglodetiposNHD = [];
      var arreglodetiposRDDD = [];
      var arreglodetiposHDDD = [];
      var arreglodetiposHMDD = [];

      // En este ciclo for se recibe y procesa cada URL de los tipos que sea el pokemon
      for (let i = 0; i < urltiposenarreglo.length; i++) {
        const urlDelTipo = urltiposenarreglo[i];
        const { data: { damage_relations: { double_damage_from, double_damage_to, half_damage_to, no_damage_to } } } = await reqAPI.get(urlDelTipo);
    
        const NoLeHaceDaño = no_damage_to.map((ndt: any) => ndt.name);
        const nhd = NoLeHaceDaño.toString();
        arreglodetiposNHD.push(nhd);
    
        const RecibeDobleDeDañoDe = double_damage_from.map((ddf: any) => ddf.name);
        const rddd = RecibeDobleDeDañoDe.toString();
        arreglodetiposRDDD.push(rddd);
    
        const HaceElDobleDeDaño = double_damage_to.map((ddt: any) => ddt.name);
        const hddd = HaceElDobleDeDaño.toString();
        arreglodetiposHDDD.push(hddd);
    
        const HaceLaMitadDeDaño = half_damage_to.map((hdt: any) => hdt.name);
        const hmdd = HaceLaMitadDeDaño.toString();
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

      setMakeHalfDamage(stringHMDD);
      setMakeDoubleDamage(stringHDDD);
      setRecieveDoubleDamage(stringRDDD);
      setNoMakeDamage(stringNHD);

      


      // DESCRIPCIÓN
      const { data: {flavor_text_entries}} = await reqAPI.get(`/pokemon-species/${nombreOnumero}`);
      const todaslasdescripciones = flavor_text_entries
      const text  = todaslasdescripciones.find((entry:any) => entry.language.name === "es");
      const { flavor_text } = text;
      setPokemonDescription(flavor_text);




      // EVOLUCIONES
      const {data: {evolution_chain}} = await reqAPI.get(`https://pokeapi.co/api/v2/pokemon-species/${nombreOnumero}`);
      const urlEvoChain = evolution_chain.url;

      const todaCadEvo = await reqAPI.get(urlEvoChain);
      const datosevo = todaCadEvo.data;


      const namesOfEvoArray = [];
      const typesOfEvoArray = [];

      function getPokemonNames(datosevo) {
        if (datosevo.hasOwnProperty("species")) {
          namesOfEvoArray.push(datosevo.species.name);
        }

        if (datosevo.hasOwnProperty("evolves_to") && datosevo.evolves_to.length > 0) {
          for (let i = 0; i < datosevo.evolves_to.length; i++) {
            getPokemonNames(datosevo.evolves_to[i]);
          }
        }
      }

      getPokemonNames(datosevo.chain);

      //Obteniendo los tipos de cada evolución del pokemon
      for (let x = 0; x < namesOfEvoArray.length; x++) {
        const nombreDeEvo = namesOfEvoArray[x];
        const { data: {types}} = await reqAPI.get(`https://pokeapi.co/api/v2/pokemon/${nombreDeEvo}`);
        const tiposenarreglo = types.map((tipos:any) =>tipos.type.name)
        const tipos = tiposenarreglo.toString();
        typesOfEvoArray.push(tipos);
      }


      // Poniendo los datos de evolución en el formato requerido
      let resultado = "";
      for (let i = 0; i < namesOfEvoArray.length; i++) {
        if (i > 0) {
          resultado += " -> ";
        }
        resultado += namesOfEvoArray[i] + " (" + typesOfEvoArray[i] + ")";
      }
      setEvolution(resultado);





    } catch (error) {
      const { message } = error;
    }

  }; 

  return (
    
    <View style={styles.sectionContainer}>
      <ScrollView>

        <Text style={styles.sectionContainer}>
            {"\n\n\n"}
            {cargando}
        </Text>
       
        <TextInput 
        placeholder="Ingrese el ID o nombre del Pokemon"
        value={text}
        onChangeText={setText}
        onSubmitEditing={() => waitPlease(true)}
        />
        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
            Nombre: {JSON.stringify(name, null, 2)}
        </Text>

        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          Tipo(s):{JSON.stringify(types, null, 2)}
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

        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          Movimientos: {JSON.stringify(moves, null, 2)}
        </Text>

        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          Evolución: {JSON.stringify(evolution, null, 2)}
        </Text>

        </ScrollView>
        
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});