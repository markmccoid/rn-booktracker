import { View, Text, Pressable } from "react-native";
import React, { useReducer, useState } from "react";
import {
  useAppliedSort,
  useFilterActions,
  AppliedSort,
} from "../../../data/store";
import DragDropEntry, {
  DragItem,
  sortArray,
  TScrollFunctions,
} from "@markmccoid/react-native-drag-and-order";
import SortItem from "./SortItem";

export type ItemType = {
  // id: number | string;
  sortField: string;
  displayName: string;
  sortDirection: string;
  active: boolean;
  pos: number;
};

type SortKeys = keyof ItemType;
const SortMain = () => {
  const { setSort } = useFilterActions();
  const appliedSort = useAppliedSort();
  // Called when a sort item attribute is changed.
  // Current attributes are active (true/false) and sortDirection (asc/desc)
  const handleSortAttributeChange = (
    sortId: string,
    sortAttribute: "active" | "sortDirection",
    newVal: string
  ) => {
    const newSort = [...appliedSort];
    newSort.forEach((el: ItemType) => {
      if (el.sortField === sortId) el[sortAttribute] = newVal;
    });
    setSort(newSort);
  };

  return (
    <View className="flex-1">
      <DragDropEntry
        scrollStyles={{
          // width: 300,
          // height: "30%",
          borderWidth: 1,
          borderColor: "#aaa",
        }}
        updatePositions={(positions) =>
          setSort(
            // @ts-ignore
            sortArray<AppliedSort>(positions, appliedSort, {
              positionField: "pos",
              idField: "sortField",
            })
          )
        }
        // getScrollFunctions={(functionObj) => setScrollFunctions(functionObj)}
        itemHeight={30}
        handlePosition="left"
        // handle={AltHandle} // This is optional.  leave out if you want the default handle
        enableDragIndicator={true}
      >
        {appliedSort.map((item, idx) => {
          return (
            <SortItem
              itemHeight={30}
              key={item.sortField}
              name={item.displayName}
              id={item.sortField}
              active={item.active}
              sortDirection={item.sortDirection}
              onUpdateSortDets={(sortAttribute, newVal) =>
                handleSortAttributeChange(item.sortField, sortAttribute, newVal)
              }
            />
          );
        })}
      </DragDropEntry>
    </View>
  );
};

export default SortMain;
