import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import EditScreenInfo from "../../../components/EditScreenInfo";
import { Text, View } from "../../../components/Themed";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>This is the Settings Screen</Text>
      <Link
        href="./settings/settingsdetails"
        style={{ borderWidth: 1, padding: 2 }}
      >
        Link To Settings Detail
      </Link>
      <Link
        href="./settings/dropboxaccess"
        style={{ borderWidth: 1, padding: 2 }}
      >
        Link To Dropbox Access
      </Link>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
