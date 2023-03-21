import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useAuth } from "../../../../auth/provider";
import {
  useAppliedFilters,
  useBookActions,
  useBookStore,
} from "../../../../data/store";
import { useFilteredBooks } from "../../../../data/store";
import BookList from "../../../../components/books/BookList";

//---------------------------------------
//-- BOOK Tab
//---------------------------------------
const BookListIndex = () => {
  // const { bookData } = useAuth();
  // const books = useBookStore((state) => state.books);
  // const books = useBookActions().useFilteredBooks();
  // const books = useBookStore((state) => state.books);
  // const filters = useAppliedFilters();
  const { books } = useFilteredBooks();
  // console.log("Filters", filters);

  // React.useEffect(() => {

  // }, [filters])
  return (
    <View style={{ flex: 1 }}>
      <Text>My Books</Text>
      <Link href="./books/bookFilter">Filter</Link>
      <Link href={{ pathname: "/books/abcdefg", params: { teswt: 123 } }}>
        Book Detail - {books?.length}
      </Link>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <BookList books={books} />
      </View>
    </View>
  );
};

export default BookListIndex;
