import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";

const ThreeDotTwo = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          title: "3.2",
        }}
      />
      <Text>ThreeDotTwo</Text>
      <Link href={"/three/threeModal"}>Modal Link</Link>
    </View>
  );
};

export default ThreeDotTwo;
