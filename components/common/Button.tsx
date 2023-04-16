import React, { useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { MotiPressable } from "moti/interactions";

type Props = {
  style?: ViewStyle;
  action: () => void;
  children: React.ReactNode;
};
const Button = ({ style = {}, action, children }: Props) => {
  return (
    <MotiPressable
      style={{ ...style }}
      onPress={action}
      animate={useMemo(
        () =>
          ({ hovered, pressed }) => {
            "worklet";

            return {
              opacity: hovered || pressed ? 0.5 : 1,
              scale: hovered || pressed ? 1.1 : 1,
            };
          },
        []
      )}
    >
      {children}
    </MotiPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    flexDirection: "row",
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonText: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 20,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});

export default Button;
