import { View, Text } from "react-native";
import React, { useState } from "react";
import RadioGroup from "../../inputs/RadioButton/RadioGroup";
import { useAppliedFilters, useFilterActions } from "../../../data/store";
import { filter } from "lodash";

const SourceFilter = () => {
  const appliedFilters = useAppliedFilters();
  const filterActions = useFilterActions();
  const [selectedOption, setSelectedOption] = useState(
    appliedFilters.source || "all"
  );

  const onSourceSelected = (selectedSource: string) => {
    setSelectedOption(selectedSource);
    if (selectedSource === "all") {
      filterActions.addFilter({ source: undefined });
      return;
    }
    filterActions.addFilter({ source: selectedSource });
  };

  return (
    <View className="flex flex-col flex-grow">
      <Text>Source Filter</Text>
      <View className="border border-red-900 flex-grow">
        <RadioGroup
          options={["all", "audible", "dropbox"]}
          selectedOption={selectedOption}
          onSelect={onSourceSelected}
          config={{ alignment: "column" }}
        />
      </View>
    </View>
  );
};

export default SourceFilter;
