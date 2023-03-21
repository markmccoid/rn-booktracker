import { View, Text, Pressable } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  useAppliedFilters,
  useBookStore,
  useFilterActions,
} from "../../../data/store";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";

function buildDropdown(inArray: string[]) {
  return inArray.map((cat) => ({
    label: cat,
    value: cat,
  }));
}
const Categories = () => {
  // const [primaryCategory, setPrimaryCategory] = useState<string>(undefined);
  // const [secondaryCategory, setSecondaryCategory] = useState<string>(undefined);
  const [mv, setmv] = useState<string[]>([]);
  const [isFocus, setIsFocus] = useState(false);
  const { primaryCategory, secondaryCategory } = useAppliedFilters();
  const { categoryMap, primaryCategories, secondaryCategories } = useBookStore(
    (state) => state.bookMetadata
  );
  const [localPrimary, setLocalPrimary] = useState(primaryCategory);
  const [localSecondary, setLocalSecondary] = useState(secondaryCategory);
  const filterActions = useFilterActions();

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
    filterActions.addFilter({
      primaryCategory: localPrimary,
      secondaryCategory: localSecondary,
    });
  }, [localPrimary, localSecondary]);

  return (
    <View className="flex flex-row space-x-2 ml-1 mr-1">
      <View className="flex-grow">
        <View className="flex-row justify-between mr-2 items-center">
          <Text className="pl-1 text-sm">Primary Category</Text>
          <Pressable onPress={() => setLocalPrimary(undefined)}>
            <AntDesign name="closecircle" size={16} color="black" />
          </Pressable>
        </View>
        <Dropdown
          data={ddPrimaryCategories}
          // value={primaryCategory}
          value={localPrimary}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder=""
          placeholderStyle={{ fontSize: 12 }}
          selectedTextStyle={{ fontSize: 12 }}
          style={{
            borderWidth: 1,
            paddingLeft: 5,
            margin: 0,
          }}
          itemTextStyle={{ fontSize: 12 }}
          // itemContainerStyle={{
          //   backgroundColor: "red",
          //   borderRadius: 6,
          //   marginBottom: 2,
          //   borderWidth: 1,
          //   paddingLeft: 0,
          // }}
          // renderItem={(item, selected) => (
          //   <View
          //     className={`${
          //       selected ? "bg-blue-500" : "bg-blue-100"
          //     } px-3 py-1`}
          //   >
          //     <Text>{item.label}</Text>
          //   </View>
          // )}
          onChange={(item) => {
            setLocalPrimary(item.value);
            setIsFocus(false);
            // setPrimaryCategory((prev) => {
            //   if (prev !== item.value) {
            //     setSecondaryCategory(undefined);
            //   }
            //   return item.value;
            // });
            // setIsFocus(false);
          }}
        />
      </View>
      <View className="flex-grow">
        <View className="flex-row justify-between mr-2 items-center">
          <Text className="pl-1 text-sm">Secondary Category</Text>
          <Pressable onPress={() => setLocalSecondary(undefined)}>
            <AntDesign name="closecircle" size={16} color="black" />
          </Pressable>
        </View>
        <Dropdown
          containerStyle={{
            borderWidth: 1,
            // borderColor: "blue",
            // borderRadius: 6,
            // backgroundColor: "#DBEAFE",
          }}
          style={{
            borderWidth: 1,
            paddingLeft: 5,
            margin: 0,
          }}
          itemTextStyle={{ fontSize: 12 }}
          data={ddSecondaryCategories}
          value={localSecondary}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder=""
          placeholderStyle={{ fontSize: 12 }}
          selectedTextStyle={{ fontSize: 12 }}
          onChange={(item) => {
            // setSecondaryCategory(item.value);
            setLocalSecondary(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    </View>
  );
};

export default Categories;
