import { View, Text } from "react-native";
import React from "react";
import RadioButton from "./RadioButton";

type Props = {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  config?: { alignment: "row" | "column" };
};
const RadioGroup = ({
  options,
  selectedOption,
  onSelect,
  config = { alignment: "column" },
}: Props) => {
  return (
    <View
      className={`${
        config.alignment === "column" ? "flex-col" : "flex-row"
      } justify-between`}
    >
      {options.map((option, index) => {
        return (
          <RadioButton
            key={index}
            label={option}
            checked={selectedOption === option}
            onPress={() => onSelect(option)}
            config={{ alignment: config.alignment }}
          />
        );
      })}
    </View>
  );
};

export default RadioGroup;
