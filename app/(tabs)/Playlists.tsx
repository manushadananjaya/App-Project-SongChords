import React from "react";
import { StyleSheet, View, Text } from "react-native";


export default function Playlists() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playlists</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});