import { Link } from "expo-router";
import { View, Text, FlatList, Image } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { Book } from "../../data/types";
import BookListItem from "./BookListItem";
import { useFilteredBooks } from "../../data/store";

type Props = {
  books: Book[] | [];
};
const BooksList = () => {
  const { books } = useFilteredBooks();
  return (
    <View style={{ flex: 1, flexGrow: 1 }}>
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return <BookListItem book={item} />;
        }}
      />
    </View>
  );
};

export default BooksList;
