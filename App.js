import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ProgressViewIOSBase, ScrollView } from 'react-native';
import { reqAPI, wait3SecondsAsync } from './importPromise';
import { useState, useEffect } from 'react';

export default function App() {

  return (
    <View style={styles.container}>

        <Text style={styles.sectionContainer}>
            {"\n\n\n"}
            {cargando}
        </Text>
       
        <TextInput placeholder="Ingrese el ID o nombre del Pokemon"/>
        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
            Nombre: {JSON.stringify(name, null, 2)}
        </Text>

        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          Tipos:{JSON.stringify(types, null, 2)}
        </Text>

        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
          Descripción: {JSON.stringify(description, null, 2)}
        </Text>

        <Text>{"\n\n"}</Text>

        <Text style={styles.sectionContainer}>
        No le hace daño a: {"\n"}{JSON.stringify(NoMakeDamage, null, 2)}{"\n\n"}
        Le hace la mitad de daño a: {"\n"}{JSON.stringify(MakeHalfDamage, null, 2)}{"\n\n"}
        Le hace el doble de daño a: {"\n"}{JSON.stringify(MakeDoubleDamage, null, 2)}{"\n\n"}
        Recibe el doble de daño de: {"\n"}{JSON.stringify(RecieveDoubleDamage, null, 2)}
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