import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Link, SplashScreen, Stack, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import {
  useColorScheme,
  View,
  Text,
  Linking,
  ScrollViewProps,
  Pressable,
} from "react-native";
import Drawer from "expo-router/drawer";
import { useAuth } from "../../auth/provider";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { refreshBooksFromDB } from "../../data/bookData";
import { useBookStore } from "../../data/store";
import { removeFromAsyncStorage } from "../../data/asyncStorage";

export const unstable_settings = {
  // Used for `(foo)`
  initialRouteName: "rootscreen",
};

//-- --------------------------------------
//-- Custom Drawer content
//-- --------------------------------------

function CustomDrawerContent(props) {
  const books = useBookStore((state) => state.books);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshFromDatabase = async () => {
    setIsRefreshing(true);
    await refreshBooksFromDB();
    setIsRefreshing(false);
  };
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

      <Pressable onPress={refreshFromDatabase}>
        {isRefreshing ? (
          <Text>Refreshing...</Text>
        ) : (
          <Text>Refresh Books From DB</Text>
        )}
      </Pressable>

      <Pressable onPress={() => removeFromAsyncStorage("books")}>
        <Text>Clear Books</Text>
      </Pressable>
      <View>
        <Text>Books - {books.length}</Text>
      </View>
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
