import { Link, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useAuth } from "../auth/provider";

import { Text, View } from "../components/Themed";
import { homeRoute } from "../utils/routeConsts";

export default function NotFoundScreen() {
  const segments = useSegments();
  const route = useRouter();
  const auth = useAuth();
  console.log("segments", segments);
  // useEffect(() => auth.signOut(), []);
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href={homeRoute} style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
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
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
