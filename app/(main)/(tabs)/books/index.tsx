import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

import BookList from "../../../../components/books/BookList";

//---------------------------------------
//-- BOOK Tab
//---------------------------------------
const BookListIndex = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text className="font-extrabold ">My Books</Text>
      <Link href="./books/bookFilter">Filter</Link>

      {/* <Text>Book Detail - {books?.length}</Text> */}

      <View style={{ flex: 1, flexGrow: 1 }}>
        <BookList />
      </View>
    </View>
  );
};

export default BookListIndex;
