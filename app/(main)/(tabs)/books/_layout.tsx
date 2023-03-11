import { Stack, Link, useNavigation } from "expo-router";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { drawerLeftMenu } from "../../../../utils/drawerHelpers";
import { FilterIcon } from "../../../../utils/IconComponents";
import { touchablePress } from "../../../../utils/pressableStyles";

export default function BookListStack() {
  const navigation = useNavigation();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Books",
          headerLeft: () => drawerLeftMenu(navigation, "stack"),
          headerRight: () => {
            return (
              <TouchableOpacity>
                <Link href="./books/bookFilter">
                  <FilterIcon />
                </Link>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Stack.Screen name="[bookDetail]" />
      <Stack.Screen name="bookFilter" options={{ presentation: "modal" }} />
    </Stack>
  );
}
