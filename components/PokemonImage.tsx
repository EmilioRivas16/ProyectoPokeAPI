import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';

interface Props {
  image: string;
  show: boolean;
}

const PokemonImage: React.FC<Props> = ({ image, show }) => {
  return (
    <Image style={[styles.pokemonImage, show ? null : styles.hidden]} source={{ uri: `${image}` }}></Image>
  );
}

const styles = StyleSheet.create({
  pokemonImage: {
    marginLeft: 80,
    width: 200,
    height: 200,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#029312',
    backgroundColor: '#D2FFC0',
  },
  hidden: {
    display: 'none',
  },
});

export default PokemonImage;