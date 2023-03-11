import { FontAwesome, Ionicons } from "@expo/vector-icons";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";

import { Pressable, useColorScheme } from "react-native";
import { drawerLeftMenu } from "../../../utils/drawerHelpers";
import Colors from "../../../constants/Colors";
import { BookTabIcon, TagsTabIcon } from "../../../utils/IconComponents";
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerLeft: () => drawerLeftMenu(navigation),
        headerRight: () => (
          <Link href="/modalfu" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="info-circle"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      })}
      initialRouteName="books"
    >
      <Tabs.Screen
        name="books"
        options={{
          title: "Books",
          headerShown: false,
          tabBarIcon: ({ color }) => <BookTabIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="tags"
        options={{
          tabBarLabel: "Tagsserv",
          tabBarIcon: ({ color }) => <TagsTabIcon color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
