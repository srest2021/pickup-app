import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useQueryGames from "../hooks/use-query-games";

const MyGames = () => {
  useQueryGames();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Games go here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default MyGames;
