import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  types: string;
  show: boolean;
}

const PokemonType: React.FC<Props> = ({ types, show }) => {
  return (
    <Text style={[styles.pokemonTypeDesc, show ? null : styles.hidden]}>Tipo(s):<Text style={styles.pokemonType}> {types}</Text></Text>
  );
}

const styles = StyleSheet.create({
  pokemonType: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pokemonTypeDesc: {
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

export default PokemonType;

