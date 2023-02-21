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
  const [cargando, setCargando] = useState(false);//Establecemos inicialmente el estado del loader como falso (para que cuando se ingrese el pokemon se vuelva true)
  const [showData, setShowData] = useState(false);//Establecemos inicialmente el estado del mostrar datos como falso (para que cuando termina de cargar se vuelva true)
  const [mostrarImagen, setMostrarImagen] = useState(true);
  const [text, setText] = useState(''); //Estado para recibir el texto ingresado por el usuario
  const [backgroundColor, setBackgroundColor] = useState('#CDFF91');//Establecemos el background inicial

  //Declaración de los estados donde se guardaran los datos de los pokemones
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

  //Diccionario con los tipos en español
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

  //Función que traduce strings de los tipos de ingles a español
  function traducirTiposPokemon(tiposEnIngles: any) {
    const tipos = tiposEnIngles.split(',').map((tipo: any) => tipo.trim());
    const tiposEnEspañol = tipos.map((tipo: any) => tiposPokemon[tipo] || tipo);
    return tiposEnEspañol.join(', ');
  }

  //Por medio de una interface recibimos los datos
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

  //Guardando el texto ingresado en una variable
  let nombreOnumero = text.trim().toLowerCase(); //trim() elimina espacios en blanco y toLowerCase() vuelve todo minuscula

  const waitPlease = async (showResolve:any) => {
    try {

      setMostrarImagen(false)//Ocultamos la imagen de la pokebola permanentemente
      setCargando(true); // Mostrar el texto "Cargando..."
      setBackgroundColor('#78C25C');//Oscurecemos el background cuando está "Cargando..."
      const result = await waitingTimeAsync(showResolve);// Aquí se hace la solicitud a la API y se actualizan los estados de los datos del Pokémon
      setCargando(false); // Ocultar el texto "Cargando..."
      setBackgroundColor('#CDFF91');//Aclaramos el background cuando termina de cargar

      /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

      //NOMBRE,TIPO y ATAQUES
      const { data: {name, types, moves}} = await reqAPI.get(`/pokemon/${nombreOnumero}`); //Ontenemos del API el nombre, tipos y movimientos
      setPokemonName(name);//Guardamos el nombre del pokemon en su estado correspondiente

      //COMO HAY VARIOS TIPOS USO LA FUNCIÓN MAP() PARA GUARDARLOS EN UN ARREGLO Y LUEGO CONVERTIRLOS A STRING
      const tipos = types.map((tipos: any) => tipos.type.name).toString(); //Obtenemos el elemento "name" del objeto de los tipos y además lo convertimos a string
      setPokemonType(traducirTiposPokemon(tipos));//Guardamos el tipo(s) del pokemon en su estado correspondiente

      /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

      // MOVES
      //Obtenemos el nombre del movimiento, .sort() para ordenarlo en orden alfabético y el .toString() para convertirlo a string
      const movimientos = moves.map((movimientos: any) => movimientos.move.name).sort().toString();
      const movimientos_clean = movimientos.split(",").join(", "); //Le añadimos un espacio des pues de las comas para arreglar los saltos de línea
      setMoves(movimientos_clean); //Guardamos los movimientos en su estado correspondiente

      /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

      // DAÑOS

      //Declaración de arreglos vacios donde se guardaran los daños (De una vez les especifico que tendrán strings)
      const arreglodetiposNHD: string[] = [];
      const arreglodetiposRDDD: string[] = [];
      const arreglodetiposHDDD: string[] = [];
      const arreglodetiposHMDD: string[] = [];

      //Declaramos el for que hará un ciclo por cada tipo que sea el pokemon
      for (const tipo of types) {

        const { data } = await reqAPI.get(tipo.type.url); //Obtenermos la url con la info del tipo por medio del api
        const { double_damage_from, double_damage_to, half_damage_to, no_damage_to } = data.damage_relations; //Desestructuramos para obtener los 4 datos a mostrar

        //Hacemos el push a cada arreglo, además utlizamos la funcion map() para obetener especificamente el nombre de cada tipo
        arreglodetiposNHD.push(...no_damage_to.map((ndt: any) => ndt.name));
        arreglodetiposRDDD.push(...double_damage_from.map((ddf: any) => ddf.name));
        arreglodetiposHDDD.push(...double_damage_to.map((ddt: any) => ddt.name));
        arreglodetiposHMDD.push(...half_damage_to.map((hdt: any) => hdt.name));
      }

      //Función para convertir arreglos a string y ponerle formato de "coma y espacio"
      const processTypeArray = (typeArray: any) => {
        // Filtrar elementos vacíos y convertir el arreglo a string
        let typeString = typeArray.filter(Boolean).toString();
        // Eliminar elementos duplicados y separar con ", "
        typeString = [...new Set(typeString.split(","))].join(", ");
        // En caso de que no haya elementos, poner "-----"
        if (typeString === "") {
        typeString = "-----";
        }
        return typeString;
      };

      //Guardamos los daños en sus estados correspondientes, el 'processTypeArray' los convierte a string y el 'traducirTiposPokemon' los traduce a español
      setMakeHalfDamage(traducirTiposPokemon(processTypeArray(arreglodetiposHMDD)));
      setMakeDoubleDamage(traducirTiposPokemon(processTypeArray(arreglodetiposHDDD)));
      setRecieveDoubleDamage(traducirTiposPokemon(processTypeArray(arreglodetiposRDDD)));
      setNoMakeDamage(traducirTiposPokemon(processTypeArray(arreglodetiposNHD)));

      /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

      // DESCRIPCIÓN
      const { data: {flavor_text_entries}} = await reqAPI.get(`/pokemon-species/${nombreOnumero}`); //Ontenemos la descripción del API
      const { flavor_text: DescEnEsp }  = flavor_text_entries.find((entry:any) => entry.language.name === "es"); //con la función .find obtenemos la descripción en español
      const DescripcionEnEspañol = DescEnEsp.split("\n").join(" "); //Le quitamos una \n que hay en la descripción
      setPokemonDescription(DescripcionEnEspañol);//Guardamos la descripcion en su estado correspondiente

      /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

      // EVOLUCIONES
      const {data: {evolution_chain}} = await reqAPI.get(`https://pokeapi.co/api/v2/pokemon-species/${nombreOnumero}`); //Obtenemos el objeto de la cad evo
      const urlEvoChain = evolution_chain.url; //Obtenermos la url del objeto de la cad evo (esa url nos dará los datos específicos de las evoluciones)

      const todaCadEvo = await reqAPI.get(urlEvoChain); //Accedemos a esa URL
      const datosevo = todaCadEvo.data; //Accedemos al arreglo data dentro de la ruta de la cad evo

      //Declarando arreglos vacios para ir gurdando los datos de la evolución
      const namesOfEvoArray = [];
      const typesOfEvoArray = [];

      //Función para obtener los nombres de cada pokemon de la cadena evolutiva e irlos metiendo a cada uno al arreglo "namesOfEvoArray"
      //Esta función es necesaria porque la cantidad de evoluciones varía dependiendo el pokemon y además no sabemos si el pokemon ingresado
      //es el primero o el segundo o el tercero de la cadena evolutiva, esta función se encarga de ese pedo y los pone en orden
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

      //Ejecutamos la función dse arriba
      getPokemonNames(datosevo.chain);

      //Obteniendo los tipos de cada evolución del pokemon
      for (let x = 0; x < namesOfEvoArray.length; x++) {
        const nombreDeEvo = namesOfEvoArray[x]; //El nombre del pokemon va a ser el actual del bucle for
        const { data: {types}} = await reqAPI.get(`https://pokeapi.co/api/v2/pokemon/${nombreDeEvo}`); //Obtenemos el tipo de pokemon por medio del API
        const tiposenarreglo = types.map((tipos:any) =>tipos.type.name)//Obtenemos el nombre del tipo
        const tipos = tiposenarreglo.toString(); //COnvertimos el tipo a string
        typesOfEvoArray.push(tipos); //Metemos el tipo al arreglo
      }


      // Poniendo los datos de evolución en el formato requerido "Pokemon(tipo)"
      let resultado = "";
      for (let i = 0; i < namesOfEvoArray.length; i++) {
        if (i > 0) {
          resultado += " -> "; // Le añadimos a cada Pokemon(tipo) un "->" para separalo del siguiente pokemon
        }
        const TipoDeCadEvoTraducido =  traducirTiposPokemon(typesOfEvoArray[i])
        resultado += namesOfEvoArray[i] + " (" + TipoDeCadEvoTraducido + ")"; //Juntamos todo en el formato
      }

      setEvolution(resultado); //Guardamos la cadena evolutiva en el estado

      /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
     
      //IMAGEN POKEMON
      const { data: {sprites: { front_default: urlImagenPokemon }}} = await reqAPI.get(`/pokemon/${nombreOnumero}`);//Desestructurando y obteniendo la imagen
      setImage(urlImagenPokemon);//Guardamos la imagen en su estado correspondiente

      /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

      //Sirve para establecer que no se muestre nada al iniciar la aplicación
      setShowData(true);

    } catch (error) {
      const { message } = error;
      setCargando(false);
      setBackgroundColor('#CDFF91');
    }

  }; 

  //Cambiando el 'background' cada vez que esta "Cargando..."
  useEffect(() => {
    if (cargando) {
      setBackgroundColor('#78C25C');
    } else {
      setBackgroundColor('#CDFF91');
    }
  }, [cargando]);

  //Desaparecemos la imagen de la pokebola cuando se ingresa el primer pokemon
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

          {/* Condición ternaria para que cuando esté el texto "Cargando..." desaparezcan las etiquetas del pokemon */}
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