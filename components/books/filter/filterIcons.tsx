import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewProps,
  ViewStyle,
  TextStyle,
} from "react-native";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../../constants/globalStyles";
import { ThreeWayDisplayInfo } from "./ThreeWayFilter";

export const HeartRedIcon = <AntDesign name="heart" size={18} color="red" />;
export const HeartEmptyIcon = <AntDesign name="hearto" size={18} />;
export const MinusIcon = (
  <View className="relative">
    <AntDesign
      name="hearto"
      size={18}
      color="#ffffff"
      style={{ position: "absolute" }}
    />
    <MaterialCommunityIcons
      name="slash-forward"
      size={25}
      color="#ffffff"
      style={{ position: "absolute", left: -4, top: -3 }}
    />
  </View>
);
export const OffIcon = (
  <MaterialCommunityIcons name="slash-forward" size={18} color="black" />
);

export const favoriteSwitchInfo: ThreeWayDisplayInfo[] = [
  {
    displayState: "inactive",
    displayValue: "Favorite",
    constianerStyle: { backgroundColor: "#fff" },
    textStyle: { color: "black" },
    icon: HeartEmptyIcon,
  },
  {
    displayState: "include",
    displayValue: "Favorite",
    constianerStyle: { backgroundColor: colors.includeGreen },
    textStyle: { color: "black" },
    icon: HeartRedIcon,
  },
  {
    displayState: "exclude",
    displayValue: "Favorite",
    constianerStyle: { backgroundColor: colors.excludeRed },
    textStyle: { color: "black" },
    icon: MinusIcon,
  },
];

export const listenedToSwitchInfo: ThreeWayDisplayInfo[] = [
  {
    displayState: "inactive",
    displayValue: "Listened To",
    constianerStyle: { backgroundColor: "#fff" },
    textStyle: { color: "black" },
    icon: HeartEmptyIcon,
  },
  {
    displayState: "include",
    displayValue: "Listened To",
    constianerStyle: { backgroundColor: colors.includeGreen },
    textStyle: { color: "black" },
    icon: HeartRedIcon,
  },
  {
    displayState: "exclude",
    displayValue: "Listened To",
    constianerStyle: { backgroundColor: colors.excludeRed },
    textStyle: { color: "white" },
    icon: MinusIcon,
  },
];
