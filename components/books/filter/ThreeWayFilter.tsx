import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import React, {
  ReactComponentElement,
  ReactNode,
  useReducer,
  useState,
} from "react";
import Button from "../../common/Button";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../../constants/globalStyles";

type State = "include" | "exclude" | "inactive";

type Action = {
  type: "toggle" | State;
};
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "toggle":
      switch (state) {
        case "include":
          return "exclude";
        case "exclude":
          return "inactive";
        case "inactive":
          return "include";
        default:
          throw new Error(`Unhandled state: ${state}`);
      }
    case "include":
      return "include";
    case "exclude":
      return "exclude";
    case "inactive":
      return "inactive";
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export type ThreeWayDisplayInfo = {
  displayState: State;
  displayValue: string;
  constianerStyle: ViewStyle;
  textStyle: TextStyle;
  icon: ReactNode;
};

type Props = {
  currentState?: State;
  updateState: (state: State) => void;
  displayInfo: ThreeWayDisplayInfo[];
};

const ThreeWayFilter = ({
  currentState = "inactive",
  updateState = () => {},
  displayInfo,
}: Props) => {
  const [state, dispatch] = useReducer(reducer, currentState);
  const [currentDisplayInfo, setCurrentDisplayInfo] = useState(() =>
    displayInfo.find((el) => el.displayState === currentState)
  );

  React.useEffect(() => {
    // Whenever reducer state changes, run the passed in function
    // In this case it will update the store's filter
    updateState(state);
    setCurrentDisplayInfo(displayInfo.find((el) => el.displayState === state));
  }, [state]);

  return (
    <View style={{ width: 120 }}>
      <Button
        style={{
          borderRadius: 6,
          borderWidth: StyleSheet.hairlineWidth,
          padding: 5,
          ...currentDisplayInfo?.constianerStyle,
        }}
        action={() => dispatch({ type: "toggle" })}
      >
        <View className="flex flex-row justify-center mr-1">
          {currentDisplayInfo?.icon && (
            <View className="flex-1 mr-1">{currentDisplayInfo.icon}</View>
            // <View className="mr-1 self-start border border-black flex-1">
            //   <MinusIcon />
            // </View>
          )}
          <Text style={{ ...currentDisplayInfo?.textStyle }}>
            {currentDisplayInfo?.displayValue}
          </Text>
        </View>
      </Button>
    </View>
  );
};

export default ThreeWayFilter;
