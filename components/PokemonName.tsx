import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  name: string;
  show: boolean;
}

const PokemonName: React.FC<Props> = ({ name, show }) => {
  return (
    <Text style={[styles.pokemonNameDesc, show ? null : styles.hidden]}>Nombre: <Text style={styles.pokemonName}> {name}</Text></Text>
  );
}

const styles = StyleSheet.create({
  pokemonName: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pokemonNameDesc: {
    padding: 5,
    fontSize: 18,
    marginBottom: 10,

    borderWidth: 2,
    borderColor: '#029312',
    backgroundColor: '#D2FFC0',
  },
  hidden: {
    display: 'none',
  },
});

export default PokemonName;