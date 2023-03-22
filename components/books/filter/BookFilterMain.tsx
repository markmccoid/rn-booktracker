import { filter } from "lodash";
import { useCallback, useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { MotiView } from "moti";

import {
  useAppliedFilters,
  useBookActions,
  useBookStore,
  useFilterActions,
} from "../../../data/store";
import Categories from "./Categories";
import TextFilter from "./TextFilter";
import { useFilteredBooks, getFilteredBooks } from "../../../data/store";
import { FlatList } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";

const BookFilterMain = () => {
  const filters = useAppliedFilters();
  const { books: filteredBooks, isLoading } = useFilteredBooks(); // useBookStore((state) => state.filteredBooks);
  const [books, setBooks] = useState();

  // const bookStats = useBookStats();
  //! Create a new store hook to get stats on books from filter
  //! number of books, % from audible/dropbox, distinct authors, titles by author?
  // useEffect(() => {
  //   setBooks(getFilteredBooks().books);
  // }, [filters]);
  return (
    <View>
      <Categories />

      <View className="flex flex-row ">
        <TextFilter filterName="title" label="Title" />
        <TextFilter filterName="author" label="Author" />
      </View>

      {/* <Text>FILTERS: {JSON.stringify(filters)}</Text> */}
      <Text>{filteredBooks?.length || "None"}</Text>

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
