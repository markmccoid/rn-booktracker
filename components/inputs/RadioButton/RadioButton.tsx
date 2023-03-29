import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  checked: boolean;
  onPress: () => void;
  config: { alignment: "row" | "column" };
};
const RadioButton = ({
  label,
  checked,
  onPress,
  config = { alignment: "column" },
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 8,
        }}
      >
        {config.alignment === "row" && (
          <Text style={{ marginRight: 4 }}>{label}</Text>
        )}
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#000",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {checked && (
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: "#000",
              }}
            />
          )}
        </View>
        {config.alignment === "column" && (
          <Text style={{ marginLeft: 4, marginTop: 6 }}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
