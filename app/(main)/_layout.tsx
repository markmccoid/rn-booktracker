import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Link, SplashScreen, Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import {
  useColorScheme,
  View,
  Text,
  Linking,
  ScrollViewProps,
} from "react-native";
import Drawer from "expo-router/drawer";
import { useAuth } from "../../auth/provider";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

export const unstable_settings = {
  // Used for `(foo)`
  initialRouteName: "rootscreen",
};

//-- --------------------------------------
//-- Custom Drawer content
//-- --------------------------------------
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Website"
        onPress={() => Linking.openURL("https://www.expo.dev/")}
      />
      <Link href={"/books"} onPress={() => props.navigation.closeDrawer()}>
        Home
      </Link>
      <Link href={"/tags"} onPress={() => props.navigation.closeDrawer()}>
        Tags
      </Link>
      <Link href={"/settings"} onPress={() => props.navigation.closeDrawer()}>
        Settings
      </Link>
    </DrawerContentScrollView>
  );
}
export default function MainLayoutNav() {
  const segments = useSegments();
  return (
    <>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="(tabs)" />
        <Drawer.Screen name="settings" />
      </Drawer>
    </>
  );
}
