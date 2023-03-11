import { Stack } from "expo-router";
import { drawerLeftMenu } from "../../../../utils/drawerHelpers";
import { View, Text } from "react-native";

export default function TagLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={({ navigation }) => ({
          title: "Tags",
          headerLeft: () => drawerLeftMenu(navigation, "stack"),
        })}
      />
      <Stack.Screen name="threeDotTwo" />
      <Stack.Screen name="threeModal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
