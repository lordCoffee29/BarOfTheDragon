import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Recipes() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recipes</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#666',
    fontSize: 18,
    marginTop: 10,
  },
});
