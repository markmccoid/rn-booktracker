import { useCallback, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import debounce from "lodash/debounce";

type Props = {
  initialValue: string;
  label: string;
  onValueChange: (e: string) => void;
  debounceTime?: number;
};

const McTextInput = ({
  label,
  initialValue = "",
  onValueChange,
  debounceTime = 500,
}: Props) => {
  // const filterActions = useFilterActions();
  // const filters = useAppliedFilters();
  const [isFocused, setIsFocused] = useState(false);
  // const metadata = useBookStore((state) => state.bookMetadata);

  const [inputValue, setInputValue] = useState(initialValue);

  const handleValueChange = useCallback(
    debounce((inputValue) => onValueChange(inputValue), debounceTime),
    []
  );

  return (
    <View className="flex-grow">
      <Text className="ml-2">{label}: </Text>
      <TextInput
        style={{
          borderRadius: 5,
          backgroundColor: "white",
          borderWidth: 1,
          padding: 4,
          marginVertical: 2,
          marginHorizontal: 5,
          flexGrow: 1,
          borderColor: `${isFocused ? "green" : "black"}`,
        }}
        value={inputValue}
        onChangeText={(e) => {
          setInputValue(e);
          handleValueChange(e);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        clearButtonMode="while-editing"
      />
    </View>
  );
};

export default McTextInput;
