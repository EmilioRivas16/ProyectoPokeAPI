import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  evolutions: string;
  show: boolean;
}

const PokemonEvolutions: React.FC<Props> = ({ evolutions, show }) => {
  return (
    <Text style={[styles.pokemonEvolutionsDesc, show ? null : styles.hidden]}>Cadena evolutiva: <Text style={styles.pokemonEvolutions}> {evolutions}</Text></Text>
  );
}

const styles = StyleSheet.create({
  pokemonEvolutions: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  pokemonEvolutionsDesc: {
    padding: 5,
    fontSize: 16,
    marginBottom: 10,

    borderWidth: 2,
    borderColor: '#029312',
    backgroundColor: '#D2FFC0',
  },
  hidden: {
    display: 'none',
  },
});

export default PokemonEvolutions;
