import { useCallback, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useAppliedFilters, useFilterActions } from "../../../data/store";
import debounce from "lodash/debounce";

import type { Filters } from "../../../data/store";

type Props = {
  filterName: keyof Filters;
  label: string;
};

const TextFilter = ({ filterName, label }: Props) => {
  const filterActions = useFilterActions();
  const filters = useAppliedFilters();
  const [isFocused, setIsFocused] = useState(false);
  // const metadata = useBookStore((state) => state.bookMetadata);

  const [filterValue, setFilterValue] = useState(filters?.[filterName] || "");

  const setFilter = useCallback(
    debounce(
      (filterValue) => filterActions.addFilter({ [filterName]: filterValue }),
      300
    ),
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
        value={filterValue}
        onChangeText={(e) => {
          setFilterValue(e);
          setFilter(e);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

export default TextFilter;
