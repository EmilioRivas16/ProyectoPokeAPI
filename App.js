import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ProgressViewIOSBase, ScrollView } from 'react-native';

export default function App() {

  return (
    <View style={styles.container}>
       
        <TextInput placeholder="Ingrese el ID o nombre del Pokemon"/>
        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
            Acá va el nombre del pokemon
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
            Acá va el tipo del pokemon
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
            Acá va la descripción del pokemon
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
        Tipos a los que NO le hace daño,{"\n"}
        Tipos a los que hace la mitad de daño,{"\n"}
        Tipos a los que les hace el doble de daño,{"\n"}
        Tipos a los que recibe el doble de daño,
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
        Posibles movimientos (Ataques) {"\n"}
        ordenados alfabéticamente {"\n"}
        (Flamethrower, Ice Beam, etc...).
        </Text>

        <Text>{"\n\n\n"}</Text>

        <Text style={styles.sectionContainer}>
            Cadena evolutiva (si aplica)
        </Text>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
