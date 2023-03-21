import { filter } from "lodash";
import { useCallback, useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import {
  useAppliedFilters,
  useBookActions,
  useBookStore,
  useFilterActions,
} from "../../../data/store";
import Categories from "./Categories";
import TextFilter from "./TextFilter";
import { useFilteredBooks, getFilteredBooks } from "../../../data/store";
import { ScrollView } from "react-native-gesture-handler";

const BookFilterMain = () => {
  const filters = useAppliedFilters();
  const { books: filteredBooks, isLoading } = useFilteredBooks(); // useBookStore((state) => state.filteredBooks);
  const [books, setBooks] = useState();
  console.log("filteredbooks", filteredBooks?.length, isLoading);
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

      <Text>FILTERS: {JSON.stringify(filters)}</Text>
      <Text>{filteredBooks?.length || "None"}</Text>
      {isLoading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView>
          {filteredBooks &&
            filteredBooks.map((book) => (
              <View key={book._id}>
                <Text>
                  {book.title} - {book.author}
                </Text>
              </View>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

export default BookFilterMain;
