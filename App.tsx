import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { reqAPI, waitingTimeAsync } from './importPromise';
import { Image } from 'react-native';


import PokemonName from './components/PokemonName';
import PokemonType from './components/PokemonType';
import PokemonDescription from './components/PokemonDescription';
import PokemonWeaknesses from './components/PokemonWeaknesses';
import PokemonMoves from './components/PokemonMoves';
import PokemonEvolutions from './components/PokemonEvolutions';

export default function App() {
  const [cargando, setCargando] = useState(false);
  const [showData, setShowData] = useState(false);
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [text, setText] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#CDFF91');

  const [namePokemon, setPokemonName] = useState<string | undefined>();
  const [typesPokemon, setPokemonType] = useState<string | undefined>();
  const [descriptionPokemon, setPokemonDescription] = useState<string | undefined>();

  const [NoMakeDamagePokemon, setNoMakeDamage] = useState<string | undefined>();
  const [MakeHalfDamagePokemon, setMakeHalfDamage] = useState<string | undefined>();
  const [MakeDoubleDamagePokemon, setMakeDoubleDamage] = useState<string | undefined>();
  const [RecieveDoubleDamagePokemon, setRecieveDoubleDamage] = useState<string | undefined>();

  const [movesPokemon, setMoves] = useState<string | undefined>();
  const [evolutionPokemon, setEvolution] = useState<string | undefined>();

  const pokemon: interfacePokemon = {
    name: namePokemon,
    types: typesPokemon,
    description: descriptionPokemon,
    noDamageTo: NoMakeDamagePokemon,
    halfDamageTo: MakeHalfDamagePokemon,
    doubleDamageTo: MakeDoubleDamagePokemon,
    doubleDamageFrom: RecieveDoubleDamagePokemon,
    moves: movesPokemon,
    evolutions: evolutionPokemon,
  };

  let nombreOnumero = text.trim().toLowerCase(); //trim() elimina espacios en blanco y toLowerCase() vuelve todo minuscula

  const waitPlease = async (showResolve:any) => {
    try {

      setMostrarImagen(true)
      setCargando(true); // Mostrar el texto "Cargando..."
      setBackgroundColor('#78C25C');
      const result = await waitingTimeAsync(showResolve);// Aquí se hace la solicitud a la API y se actualizan los estados de los datos del Pokémon
      setCargando(false); // Ocultar el texto "Cargando..."
      
      setBackgroundColor('#CDFF91');

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
      const movimientos_clean = movimientos.split(",").join(", ");
      setMoves(movimientos_clean);

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
      let stringHMDDfinal = stringHMDD.split(",").join(", ");
      
      if (stringHMDDfinal == "") {
        stringHMDDfinal = "-----"
      }

      let filteredarreglodetiposHDDD = arreglodetiposHDDD.filter(elm => elm); //Eliminando elementos vacios del arreglo (en caso de que hayan)
      let stringHDDD = filteredarreglodetiposHDDD.toString() //Convirtiendo el arreglo a String
      stringHDDD = Array.from(new Set(stringHDDD.split(','))).toString(); //Eliminando elementos duplicados (en caso de que haya alguno)
      let stringHDDDfinal = stringHDDD.split(",").join(", ");

      if (stringHDDDfinal == "") {
        stringHDDDfinal = "-----"
      }

      let filteredarreglodetiposRDDD = arreglodetiposRDDD.filter(elm => elm); //Eliminando elementos vacios del arreglo (en caso de que hayan)
      let stringRDDD = filteredarreglodetiposRDDD.toString() //Convirtiendo el arreglo a String
      stringRDDD = Array.from(new Set(stringRDDD.split(','))).toString();  //Eliminando elementos duplicados (en caso de que haya alguno)
      let stringRDDDfinal = stringRDDD.split(",").join(", ");

      if (stringRDDDfinal == "") {
        stringRDDDfinal = "-----"
      }

      let filteredarreglodetiposNHD = arreglodetiposNHD.filter(elm => elm); //Eliminando elementos vacios del arreglo (en caso de que hayan)
      let stringNHD = filteredarreglodetiposNHD.toString() //Convirtiendo el arreglo a String
      stringNHD = Array.from(new Set(stringNHD.split(','))).toString(); //Eliminando elementos duplicados (en caso de que haya alguno)
      let stringNHDfinal = stringNHD.split(",").join(", ");

      if (stringNHDfinal == "") {
        stringNHDfinal = "-----"
      }

      setMakeHalfDamage(stringHMDDfinal);
      setMakeDoubleDamage(stringHDDDfinal);
      setRecieveDoubleDamage(stringRDDDfinal);
      setNoMakeDamage(stringNHDfinal);

      


      // DESCRIPCIÓN
      const { data: {flavor_text_entries}} = await reqAPI.get(`/pokemon-species/${nombreOnumero}`);
      const todaslasdescripciones = flavor_text_entries
      const text  = todaslasdescripciones.find((entry:any) => entry.language.name === "es");
      const { flavor_text } = text;
      const flavor_text_clean = flavor_text.split("\n").join(" ");
      setPokemonDescription(flavor_text_clean);




      // EVOLUCIONES
      const {data: {evolution_chain}} = await reqAPI.get(`https://pokeapi.co/api/v2/pokemon-species/${nombreOnumero}`);
      const urlEvoChain = evolution_chain.url;

      const todaCadEvo = await reqAPI.get(urlEvoChain);
      const datosevo = todaCadEvo.data;


      const namesOfEvoArray = [];
      const typesOfEvoArray = [];

      function getPokemonNames(datosevo: any) {
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


      //Sirve para establecer que no se muestre nada al iniciar la aplicación
      setShowData(true);

    } catch (error) {
      const { message } = error;
      setCargando(false);
      setBackgroundColor('#CDFF91');
    }

  }; 

  useEffect(() => {
    if (cargando) {
      setBackgroundColor('#78C25C');
    } else {
      setBackgroundColor('#CDFF91');
    }
  }, [cargando]);

  const handleInputChange = (input) => {
    setText(input);
    if (mostrarImagen) { 
      setMostrarImagen(false);
    }
  }
  
  return (
    
    <ScrollView style={[styles.sectionContainer, { backgroundColor: backgroundColor }]}>

      <View style={styles.sectionView}>
        

        <Text>{"\n\n"}</Text>
        
          <View style={styles.containerTextInput}>
            <TextInput 
              placeholder="Ingrese el ID o nombre del Pokemon"
              value={text}
              onChangeText={setText}
              onSubmitEditing={() => waitPlease(true)}
              style={styles.sectionInsideContainerTextInput}
            />
          </View>

          <Text>{"\n"}</Text>

          {!mostrarImagen &&
            <Image
              source={require('./assets/pokebola.png')}
              style={{ width: 250, height: 250, marginLeft: 55, marginTop: 180 }}
            />
          }

          {cargando ? <Text style={styles.textoCargando}>Cargando...</Text> :

          <React.Fragment>

            <PokemonName name={pokemon.name} show={showData} />

            <PokemonType types={pokemon.types} show={showData} />

            <PokemonDescription description={pokemon.description} show={showData} />

            <PokemonWeaknesses
              noDamageTo={pokemon.noDamageTo}
              halfDamageTo={pokemon.halfDamageTo}
              doubleDamageTo={pokemon.doubleDamageTo}
              doubleDamageFrom={pokemon.doubleDamageFrom}
              show={showData}
            />

            <PokemonMoves moves={pokemon.moves} show={showData} />

            <PokemonEvolutions evolutions={pokemon.evolutions} show={showData} />

          </React.Fragment>
          }

      </View>

      <Text>{"\n\n"}</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#CDFF91',
    
  },
  sectionView: {
    flex: 1,
    padding: 5, 
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  containerTextInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionInsideContainerTextInput: {
    width: 300,
    height: 30,
    borderWidth: 3,
    borderColor: '#3A4231',
    textAlign: 'center',
    backgroundColor: '#DFFFD3',
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textoCargando: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 280,
    marginLeft: 110,
    fontSize: 25,
    fontWeight: 'bold'
  }
});