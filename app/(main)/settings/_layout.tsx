import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { drawerLeftMenu, homeHeaderButton } from "../../../utils/drawerHelpers";

const SettingsScreenLayout = () => {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={({ navigation }) => ({
        headerRight: () => homeHeaderButton(navigation, "stack"),
        headerLeft: () => drawerLeftMenu(navigation, "stack"),
      })}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Settings Drawer",
        }}
      />
      <Stack.Screen
        name="settingsdetails"
        options={{
          headerLeft: () => {
            return null;
          },
        }}
      />
      <Stack.Screen
        name="dropboxaccess"
        options={{
          headerLeft: () => {
            return null;
          },
        }}
      />
    </Stack>
  );
};

export default SettingsScreenLayout;
