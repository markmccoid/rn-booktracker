import { View, Text } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useBookStore, useFilterActions } from "../../../data/store";
import { Dropdown } from "react-native-element-dropdown";

function buildDropdown(inArray: string[]) {
  return inArray.map((cat) => ({
    label: cat,
    value: cat,
  }));
}
const Categories = () => {
  const [primaryCategory, setPrimaryCategory] = useState<string>(undefined);
  const [secondaryCategory, setSecondaryCategory] = useState<string>(undefined);
  const [isFocus, setIsFocus] = useState(false);
  const filterActions = useFilterActions();
  const { categoryMap, primaryCategories, secondaryCategories } = useBookStore(
    (state) => state.bookMetadata
  );

  const ddPrimaryCategories = useMemo(
    () => buildDropdown(primaryCategories),
    []
  );
  const ddSecondaryCategories = useMemo(() => {
    if (!primaryCategory) {
      return buildDropdown(secondaryCategories);
    }
    return buildDropdown(categoryMap[primaryCategory]);
  }, [primaryCategory]);

  useEffect(() => {
    filterActions.addFilter({ primaryCategory, secondaryCategory });
  }, [primaryCategory, secondaryCategory]);

  return (
    <View className="flex flex-row space-x-2 ml-2 mr-2">
      <View className="flex-grow">
        <Dropdown
          data={ddPrimaryCategories}
          value={primaryCategory}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Primary Category..."
          placeholderStyle={{ fontSize: 12 }}
          containerStyle={{
            padding: 0,
            margin: 0,
            borderWidth: 1,
            borderColor: "blue",
          }}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 5,
            margin: 0,
            height: 40,
          }}
          itemTextStyle={{ fontSize: 12 }}
          itemContainerStyle={{
            backgroundColor: "red",
            borderWidth: 1,
            paddingLeft: 0,
          }}
          renderItem={(item, selected) => (
            <View className={`${selected ? "bg-blue-500" : "bg-red-500"}`}>
              <Text>{item.label}</Text>
            </View>
          )}
          onChange={(item) => {
            setPrimaryCategory((prev) => {
              if (prev !== item.value) {
                setSecondaryCategory(undefined);
              }
              return item.value;
            });
            setIsFocus(false);
          }}
        />
      </View>

      <View className="flex-grow">
        <Dropdown
          data={ddSecondaryCategories}
          value={secondaryCategory}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Secondary Category..."
          onChange={(item) => {
            setSecondaryCategory(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    </View>
  );
};

export default Categories;
