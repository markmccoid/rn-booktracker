import { useSegments } from "expo-router";
import Drawer from "expo-router/drawer";

export const unstable_settings = {
  // Used for `(foo)`
  initialRouteName: "rootscreen",
};
import DrawerContents from "../../components/drawer/DrawerContents";

export default function MainLayoutNav() {
  const segments = useSegments();
  return (
    <>
      <Drawer
        drawerContent={(props) => <DrawerContents {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#c6cbef",
            width: 240,
          },
        }}
      >
        <Drawer.Screen name="(tabs)" />
        <Drawer.Screen name="settings" />
      </Drawer>
    </>
  );
}
