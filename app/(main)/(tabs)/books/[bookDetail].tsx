import { View, Text, Button, Switch } from "react-native";
import React, { useCallback, useEffect, useMemo } from "react";
import { Stack, useSearchParams } from "expo-router";
import {
  useBookActions,
  useBookStore,
  logUserOut,
} from "../../../../data/store";
import BookImage from "../../../../components/books/BookImage";
import DetailContainer from "../../../../components/books/bookDetail/DetailContainer";
const BookDetail = () => {
  const { getBookDetail, updateUserBookData } = useBookActions();
  const searchParams = useSearchParams();
  const bookData = getBookDetail(searchParams.bookDetail);
  console.log("getting book detail");

  const onSetFavorite = async () => {
    // Need to merge data if already saved
    // This is where we need a separate function into async
    if (bookData?._id) {
      await updateUserBookData(bookData?._id, {
        favorite: !bookData?.favorite,
      });
      getBookDetail(searchParams.bookDetail);
    }
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: bookData?.title,
          headerRight: () => {
            return <Text>H</Text>;
          },
        }}
      />
      <DetailContainer bookId={searchParams.bookDetail} />
    </View>
  );
};

export default BookDetail;
