import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

const App = ({ onPress, title, color, width, height, fontSize }) => {
  if (!width) {
    width = 271
  }
  if (!height) {
    height = 75
  }
  if (!fontSize) {
    fontSize = 25
  }
  return (
    <TouchableOpacity onPress={onPress} style={{
        backgroundColor: color,
        borderRadius: 20,
        width,
        height,
        justifyContent: "center",
        // paddingVertical: 18,
        // paddingHorizontal: 30,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.75,
        shadowRadius: 2,  
        elevation: 5
      }}>
        <Text style={{
          fontSize,
          color: "#FFFFFF",
          fontWeight: "bold",
          alignSelf: "center",
        }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default App;
