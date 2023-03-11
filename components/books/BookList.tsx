import { Link } from "expo-router";
import { View, Text, FlatList, Image } from "react-native";
import { Book } from "../../data/types";
import BookListItem from "./BookListItem";

type Props = {
  books: Book[];
};
const BooksList = ({ books }: Props) => {
  return (
    <View>
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
