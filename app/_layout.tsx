import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme, View, Text } from "react-native";
import Drawer from "expo-router/drawer";
import { Provider, useProtectedRoute } from "../auth/provider";
import { useCurrentUser, onInitialize, useIsLoggedIn } from "../data/store";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await onInitialize();
      // initalizeBooks();
      console.log("Initializing done");
      setIsLoading(false);
    };
    initializeApp();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);
  const segments = useSegments();
  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded || isLoading ? <SplashScreen /> : <RootLayoutNav />}
      {/* {loaded && <RootLayoutNav />} */}
    </>
  );
}

function RootLayoutNav() {
  const loggedIn = useIsLoggedIn();
  useProtectedRoute(loggedIn);
  const colorScheme = useColorScheme();

  return (
    <>
      {/* <Provider> */}
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Slot />
      </ThemeProvider>
      {/* </Provider> */}
    </>
  );
}
