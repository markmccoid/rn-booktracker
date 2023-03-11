import { View, Text, Image, FlatList } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { useAuth } from "../../../../auth/provider";
import { useBookStore } from "../../../../data/store";
import { useFilteredBooks } from "../../../../data/useFilteredBooks";
import BookList from "../../../../components/books/BookList";

//---------------------------------------
//-- BOOK Tab
//---------------------------------------
const BookListIndex = () => {
  // const { bookData } = useAuth();
  // const books = useBookStore((state) => state.books);
  const books = useFilteredBooks();

  return (
    <View>
      <Text>My Books</Text>
      <Link href="./books/bookFilter">Filter</Link>
      <Link href={{ pathname: "/books/abcdefg", params: { teswt: 123 } }}>
        Book Detail - {books.length}
      </Link>
      <BookList books={books} />
    </View>
  );
};

export default BookListIndex;
