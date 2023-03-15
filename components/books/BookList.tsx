import { Link } from "expo-router";
import { View, Text, FlatList, Image } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { Book } from "../../data/types";
import BookListItem from "./BookListItem";

type Props = {
  books: Book[] | [];
};
const BooksList = ({ books }: Props) => {
  return (
    <View style={{ flex: 1, flexGrow: 1 }}>
      <Text>BooksList</Text>
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
