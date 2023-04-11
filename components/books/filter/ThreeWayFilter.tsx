import { View, Text, Pressable } from "react-native";
import React, { useReducer } from "react";

type State = "include" | "exclude" | "off";

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
          return "off";
        case "off":
          return "include";
        default:
          throw new Error(`Unhandled state: ${state}`);
      }
    case "include":
      return "include";
    case "exclude":
      return "exclude";
    case "off":
      return "off";
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

type Props = {
  stateFunction: (state: State) => void;
};
const ThreeWayFilter = ({ stateFunction = () => {} }: Props) => {
  const [state, dispatch] = useReducer(reducer, "off");

  React.useEffect(() => {
    stateFunction(state);
  }, [state]);

  return (
    <View>
      <Text>{state}</Text>
      <Pressable onPress={() => dispatch({ type: "toggle" })}>
        <Text>Toggle State</Text>
      </Pressable>
    </View>
  );
};

export default ThreeWayFilter;
