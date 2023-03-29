/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

//ADD Delete icon and delete function from Store so Deletoing of item can be tested.
//Update Items array to be generic items (maybe grocery list)
//Make item ids alpha
const SortItem = ({
  name,
  id,
  active,
  sortDirection,
  itemHeight,
  onUpdateSortDets,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isMoving = false, // injected into component when list created
}: {
  name: string;
  id: string | number;
  active: boolean;
  sortDirection: "asc" | "desc";
  itemHeight: number;
  onUpdateSortDets: (sortAttribute, newVal) => void;
  isMoving?: boolean;
}) => {
  const [localActive, setLocalActive] = useState(active);
  const [localDirection, setLocalDirection] = useState(sortDirection);
  const handleToggle = () => {
    setLocalActive((prev) => !prev);
  };

  useEffect(() => {
    setTimeout(() => onUpdateSortDets("active", localActive), 0);
  }, [localActive]);

  useEffect(() => {
    setTimeout(() => onUpdateSortDets("sortDirection", localDirection), 0);
  }, [localDirection]);
  return (
    <View
      className={`${!localActive ? "bg-gray-300" : "bg-white"}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: itemHeight,
        paddingVertical: 2,
        paddingHorizontal: 10,
        // backgroundColor: active ? "white" : "gray",
        borderWidth: 0.5,
        borderColor: "#aaa",
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "400",
          marginRight: 10,
        }}
      >
        {name}
      </Text>

      {/* <Text
        style={{ fontSize: 16, color: "gray", fontWeight: "600" }}
      >{`(id-${id})`}</Text> */}
      <View className="flex flex-row justify-end  flex-grow">
        <TouchableOpacity
          onPress={() => setLocalDirection("asc")}
          disabled={!localActive}
        >
          <AntDesign
            name="caretup"
            size={24}
            color={localDirection === "asc" ? "green" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => setLocalDirection("desc")}
          disabled={!localActive}
        >
          <AntDesign
            name="caretdown"
            size={24}
            color={localDirection === "desc" ? "green" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleToggle}
          // onPress={() => {
          //   onToggleActive();
          // }}
          // style={{ position: "absolute", right: 15 }}
          style={{ marginLeft: 20 }}
        >
          <Feather
            name="power"
            size={24}
            color={localActive ? "green" : "red"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SortItem;
