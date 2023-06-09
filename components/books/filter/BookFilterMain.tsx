import { filter } from "lodash";
import { useCallback, useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, TextInput, Switch } from "react-native";
import { MotiView } from "moti";

import Categories from "./Categories";
import {
  useAppliedFilters,
  useFilterActions,
  useFilteredBooks,
} from "../../../data/store";
import { FlatList } from "react-native-gesture-handler";
import SortMain from "../sort/SortMain";
import McTextInput from "../../inputs/McTextInput/Index";
import SourceFilterBlocks from "./SourceFilterBlocks";
import ThreeWayFilter from "./ThreeWayFilter";
import { favoriteSwitchInfo, listenedToSwitchInfo } from "./filterIcons";

const BookFilterMain = () => {
  const { books: filteredBooks, isLoading } = useFilteredBooks(); // useBookStore((state) => state.filteredBooks);
  const filterActions = useFilterActions();
  const filters = useAppliedFilters();

  return (
    <View>
      <Categories />

      <View className="flex flex-row ">
        {/* <TextFilter filterName="title" label="Title" />
        <TextFilter filterName="author" label="Author" /> */}
        <McTextInput
          initialValue={filters.title || ""}
          label="Title"
          onValueChange={(val) => filterActions.addFilter({ title: val })}
        />
        <McTextInput
          initialValue={filters.author || ""}
          label="Author"
          onValueChange={(val) => filterActions.addFilter({ author: val })}
        />
      </View>

      <View className="flex flex-row border border-red-900">
        <View className="flex flex-col">
          {/* <SourceFilter /> */}
          <SourceFilterBlocks />
        </View>
        <SortMain />
      </View>

      <View>
        <ThreeWayFilter
          currentState={filters.favorite}
          updateState={(state) => filterActions.addFilter({ favorite: state })}
          displayInfo={favoriteSwitchInfo}
        />
        <ThreeWayFilter
          currentState={filters.listenedTo}
          updateState={(state) =>
            filterActions.addFilter({ listenedTo: state })
          }
          displayInfo={listenedToSwitchInfo}
        />
      </View>
      <View className="p-2 border-b border-b-orange-700 mb-2">
        <Text>{`Books Found -> ${filteredBooks?.length || "None"}`}</Text>
      </View>

      {isLoading ? (
        <MotiView
          className="flex justify-center items-center"
          from={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 1000, loop: true }}
        >
          <Text className="text-xl">Loading...</Text>
        </MotiView>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <Text>
                {item.title} - {item.author}
              </Text>
            );
          }}
        />
      )}
    </View>
  );
};

export default BookFilterMain;
function useAppliedActions(): { setSort: any } {
  throw new Error("Function not implemented.");
}
