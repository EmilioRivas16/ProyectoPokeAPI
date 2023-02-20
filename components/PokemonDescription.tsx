import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  description: string;
  show: boolean;
}

const PokemonDescription: React.FC<Props> = ({ description, show }) => {
  return (
    <Text style={[styles.pokemonDescriptionDesc,, show ? null : styles.hidden]}>Descripción: <Text style={styles.pokemonDescription}>{description}</Text></Text>
  );
}

const styles = StyleSheet.create({
  pokemonDescription: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pokemonDescriptionDesc: {
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

export default PokemonDescription;

