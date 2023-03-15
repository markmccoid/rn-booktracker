import { View, Text, Button, Switch } from "react-native";
import React, { useCallback, useEffect, useMemo } from "react";
import { Stack, useSearchParams } from "expo-router";
import {
  useBookActions,
  useBookStore,
  logUserOut,
} from "../../../../data/store";

const BookDetail = () => {
  const { getBookDetail, updateUserBookData } = useBookActions();
  const searchParams = useSearchParams();
  const bookData = useBookStore((state) => state.currentBook);

  useEffect(() => {
    getBookDetail(searchParams.bookDetail);
  }, [searchParams]);
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
      <Text>{bookData?.title}</Text>
      <Text>{bookData?.author}</Text>
      <Switch onValueChange={onSetFavorite} value={bookData?.favorite} />
      <Button onPress={() => logUserOut()} title="Sign Out" />
    </View>
  );
};

export default BookDetail;
