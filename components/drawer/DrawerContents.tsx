import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, Text, Linking, StyleSheet, Pressable } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
// import { refreshBooksFromDB } from "../../data/bookData";
import { useBookStore, logUserOut, useAuthUser } from "../../data/store";
import { removeFromAsyncStorage } from "../../data/asyncStorage";
import SortMain from "../../components/books/sort/SortMain";
import { MotiView, useDynamicAnimation } from "moti";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { AnimateHeight } from "../animated/AnimatedHeight";
import SourceFilterBlocks from "../books/filter/SourceFilterBlocks";
import { HomeIcon, SettingsIcon, UserIcon } from "../common/Icons";

export const unstable_settings = {
  // Used for `(foo)`
  initialRouteName: "rootscreen",
};

//-- --------------------------------------
//-- Custom Drawer content
//-- --------------------------------------

function CustomDrawerContent(props) {
  const user = useAuthUser();
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const router = useRouter();
  const books = useBookStore((state) => state.books);
  const refreshBooksFromDB = useBookStore(
    (state) => state.actions.refreshBooksFromDB
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshFromDatabase = async () => {
    setIsRefreshing(true);
    await refreshBooksFromDB();
    setIsRefreshing(false);
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItem
        label="Website"
        onPress={() => Linking.openURL("https://www.expo.dev/")}
      /> */}
      <View style={styles.userInfo}>
        <UserIcon
          size={20}
          color="blue"
          style={{ marginLeft: 20, paddingRight: 20, paddingTop: 10 }}
        />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          <Text style={styles.userText}>User: {user?.username}</Text>
          <Text style={styles.userText}>{`Book Tracker`}</Text>
        </View>
      </View>

      <View style={styles.menuItemStyle}>
        <DrawerItem
          label={({ focused, color }) => <Text style={{ color }}>Home</Text>}
          icon={({ focused, color, size }) => <HomeIcon size={size} />}
          onPress={() => {
            router.push("/books");
            props.navigation.closeDrawer();
          }}
        />
      </View>
      <View style={styles.menuItemStyle}>
        <DrawerItem
          label="Tags"
          onPress={() => {
            router.push("/tags");
            props.navigation.closeDrawer();
          }}
        />
      </View>

      <View style={styles.menuItemStyle}>
        <DrawerItem
          label="Settings"
          icon={({ focused, color, size }) => <SettingsIcon size={size} />}
          onPress={() => {
            router.push("/settings");
            props.navigation.closeDrawer();
          }}
        />
      </View>
      <DrawerItem
        label={({ focused, color }) => (
          <Text style={{ color: sortVisible ? "red" : "black" }}>Sort</Text>
        )}
        onPress={() => {
          setSortVisible((prev) => !prev);
        }}
        activeTintColor="blue"
      />

      <AnimateHeight hide={!sortVisible} style={{ marginHorizontal: 15 }}>
        <View className="mb-5">
          <SortMain />
        </View>
      </AnimateHeight>

      <Pressable onPress={() => setFilterVisible((prev) => !prev)}>
        <View className="mx-2">
          <Text>Source</Text>
          <AnimateHeight hide={!filterVisible} style={{ marginHorizontal: 15 }}>
            <View className="mb-5">
              <SourceFilterBlocks />
            </View>
          </AnimateHeight>
        </View>
      </Pressable>

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
      <Pressable onPress={logUserOut}>
        <Text>Sign Out</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  menuItemStyle: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userInfo: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    paddingVertical: 15,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    color: "black",
  },
});
export default CustomDrawerContent;
