import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  moves: string;
  show: boolean;
}

const PokemonMoves: React.FC<Props> = ({ moves, show }) => {
  return (
    <Text style={[styles.pokemonMovesDesc, show ? null : styles.hidden]}>Posibles movimientos: <Text style={styles.pokemonMoves}>{moves}</Text></Text>
  );
}

const styles = StyleSheet.create({
  pokemonMoves: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pokemonMovesDesc: {
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

export default PokemonMoves;
