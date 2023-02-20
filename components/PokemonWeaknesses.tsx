import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  noDamageTo: string;
  halfDamageTo: string;
  doubleDamageTo: string;
  doubleDamageFrom: string;
  show: boolean;
}

const PokemonWeaknesses: React.FC<Props> = ({
  noDamageTo,
  halfDamageTo,
  doubleDamageTo,
  doubleDamageFrom,
  show
}) => {
  return (
    <Text style={[styles.pokemonWeaknesses, show ? null : styles.hidden]}>
      No le hace daño a: <Text style={styles.pokemonWeaknessesDesc}>{noDamageTo}</Text>{"\n\n"}
      Le hace la mitad de daño a: <Text style={styles.pokemonWeaknessesDesc}>{halfDamageTo}</Text>{"\n\n"}
      Le hace el doble de daño a: <Text style={styles.pokemonWeaknessesDesc}>{doubleDamageTo}</Text>{"\n\n"}
      Recibe el doble de daño de: <Text style={styles.pokemonWeaknessesDesc}>{doubleDamageFrom}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  pokemonWeaknesses: {
    padding: 5,
    fontSize: 17,
    marginBottom: 10,

    borderWidth: 2,
    borderColor: '#029312',
    backgroundColor: '#D2FFC0',
  },
  pokemonWeaknessesDesc: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hidden: {
    display: 'none',
  },
});

export default PokemonWeaknesses;

