import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useAppliedFilters, useFilterActions } from "../../../data/store";

const SourceFilterBlocks = () => {
  const appliedFilters = useAppliedFilters();
  const filterActions = useFilterActions();
  const [selectedOption, setSelectedOption] = useState(
    appliedFilters.source || "all"
  );

  const sourceMap = [
    { name: "All", value: "all" },
    { name: "Dropbox", value: "dropbox" },
    { name: "Audible", value: "audible" },
  ];

  const onSourceSelected = (selectedSource: string) => {
    setSelectedOption(selectedSource);
    // Put in setTimeout because book filter function is triggered when
    // addFilter is run and is slow.  This allows UI to update and then
    // for the filter to run.
    setTimeout(() => {
      if (selectedSource === "all") {
        filterActions.addFilter({ source: undefined });
        return;
      }
      filterActions.addFilter({ source: selectedSource });
    }, 0);
  };

  return (
    <View className="flex flex-col flex-grow">
      {sourceMap.map((el) => (
        <Pressable onPress={() => onSourceSelected(el.value)} key={el.name}>
          <View
            className={`flex justify-center border ${
              selectedOption === el.value
                ? "border-red-400 bg-red-200"
                : "border-gray-400 bg-white"
            } px-2 py-1 mb-1 `}
          >
            {selectedOption === el.value && (
              <View
                className="bg-red-700"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  position: "absolute",
                  right: 5,
                }}
              />
            )}
            <Text>{el.name}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default SourceFilterBlocks;
