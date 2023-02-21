import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Image } from 'react-native';
import { reqAPI, waitingTimeAsync } from './importPromise';

//Importaciones de los componentes
import PokemonName from './components/PokemonName';
import PokemonType from './components/PokemonType';
import PokemonDescription from './components/PokemonDescription';
import PokemonWeaknesses from './components/PokemonWeaknesses';
import PokemonMoves from './components/PokemonMoves';
import PokemonEvolutions from './components/PokemonEvolutions';
import PokemonImage from './components/PokemonImage';

export default function App() {
  const [cargando, setCargando] = useState(false);
  const [showData, setShowData] = useState(false);
  const [mostrarImagen, setMostrarImagen] = useState(true);
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
  const [evolutionImage, setImage] = useState<string | undefined>();


  const tiposPokemon = {
    normal: 'normal',
    fire: 'fuego',
    water: 'agua',
    electric: 'eléctrico',
    grass: 'planta',
    ice: 'hielo',
    fighting: 'lucha',
    poison: 'veneno',
    ground: 'tierra',
    flying: 'volador',
    psychic: 'psíquico',
    bug: 'bicho',
    rock: 'roca',
    ghost: 'fantasma',
    dragon: 'dragón',
    dark: 'siniestro',
    steel: 'acero',
    fairy: 'hada'
  };


  function traducirTiposPokemon(tiposEnIngles: any) {
    const tipos = tiposEnIngles.split(',').map((tipo: any) => tipo.trim());
    const tiposEnEspañol = tipos.map((tipo: any) => tiposPokemon[tipo] || tipo);
    return tiposEnEspañol.join(', ');
  }

  
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
    image: evolutionImage
  };


  let nombreOnumero = text.trim().toLowerCase(); 

  const waitPlease = async (showResolve:any) => {
    try {

      setMostrarImagen(false)
      setCargando(true); 
      setBackgroundColor('#78C25C');
      const result = await waitingTimeAsync(showResolve);
      setCargando(false); 
      setBackgroundColor('#CDFF91');

      

      const { data: {name, types, moves}} = await reqAPI.get(`/pokemon/${nombreOnumero}`); 
      setPokemonName(name);


      const tipos = types.map((tipos: any) => tipos.type.name).toString(); 
      setPokemonType(traducirTiposPokemon(tipos));

      


      const movimientos = moves.map((movimientos: any) => movimientos.move.name).sort().toString();
      const movimientos_clean = movimientos.split(",").join(", ");
      setMoves(movimientos_clean); 


      const arreglodetiposNHD: string[] = [];
      const arreglodetiposRDDD: string[] = [];
      const arreglodetiposHDDD: string[] = [];
      const arreglodetiposHMDD: string[] = [];


      for (const tipo of types) {

        const { data } = await reqAPI.get(tipo.type.url); 
        const { double_damage_from, double_damage_to, half_damage_to, no_damage_to } = data.damage_relations; 


        arreglodetiposNHD.push(...no_damage_to.map((ndt: any) => ndt.name));
        arreglodetiposRDDD.push(...double_damage_from.map((ddf: any) => ddf.name));
        arreglodetiposHDDD.push(...double_damage_to.map((ddt: any) => ddt.name));
        arreglodetiposHMDD.push(...half_damage_to.map((hdt: any) => hdt.name));
      }


      const processTypeArray = (typeArray: any) => {
 
        let typeString = typeArray.filter(Boolean).toString();
  
        typeString = [...new Set(typeString.split(","))].join(", ");
   
        if (typeString === "") {
        typeString = "-----";
        }
        return typeString;
      };

      
      setMakeHalfDamage(traducirTiposPokemon(processTypeArray(arreglodetiposHMDD)));
      setMakeDoubleDamage(traducirTiposPokemon(processTypeArray(arreglodetiposHDDD)));
      setRecieveDoubleDamage(traducirTiposPokemon(processTypeArray(arreglodetiposRDDD)));
      setNoMakeDamage(traducirTiposPokemon(processTypeArray(arreglodetiposNHD)));

      const { data: {flavor_text_entries}} = await reqAPI.get(`/pokemon-species/${nombreOnumero}`); 
      const { flavor_text: DescEnEsp }  = flavor_text_entries.find((entry:any) => entry.language.name === "es"); 
      const DescripcionEnEspañol = DescEnEsp.split("\n").join(" ");
      setPokemonDescription(DescripcionEnEspañol);


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


      for (let x = 0; x < namesOfEvoArray.length; x++) {
        const nombreDeEvo = namesOfEvoArray[x]; 
        const { data: {types}} = await reqAPI.get(`https://pokeapi.co/api/v2/pokemon/${nombreDeEvo}`); 
        const tiposenarreglo = types.map((tipos:any) =>tipos.type.name)
        const tipos = tiposenarreglo.toString(); 
        typesOfEvoArray.push(tipos); 
      }


 
      let resultado = "";
      for (let i = 0; i < namesOfEvoArray.length; i++) {
        if (i > 0) {
          resultado += " -> "; 
        }
        const TipoDeCadEvoTraducido =  traducirTiposPokemon(typesOfEvoArray[i])
        resultado += namesOfEvoArray[i] + " (" + TipoDeCadEvoTraducido + ")"; 
      }

      setEvolution(resultado); 
    
      const { data: {sprites: { front_default: urlImagenPokemon }}} = await reqAPI.get(`/pokemon/${nombreOnumero}`);//Desestructurando y obteniendo la imagen
      setImage(urlImagenPokemon);


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


  const handleInputChange = (input: any) => {
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

          {mostrarImagen &&
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

            <PokemonImage image={pokemon.image} show={showData} />

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