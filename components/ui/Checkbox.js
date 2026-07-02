import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

const Checkbox = ({ checked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
      <View style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        backgroundColor: checked ? "#007bff" : "transparent"
      }}>
        {checked && <View style={{ width: 10, height: 10, backgroundColor: "#fff" }} />}
      </View>
      <Text>{checked ? "Selected" : "Not Selected"}</Text>
    </TouchableOpacity>
  );
};

export default Checkbox;
