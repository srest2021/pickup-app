import React from "react";
import { View, Text, StyleSheet } from "react-native";


// add event listener so that page is constantly updating! 
const Feed = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feed here</Text>
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

export default Feed;
