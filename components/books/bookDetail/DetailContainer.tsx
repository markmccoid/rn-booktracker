import { View, Text } from "react-native";
import React, { useEffect, useMemo } from "react";
import { useBookActions } from "../../../data/store";
import BookImage from "../BookImage";
import { ScrollView } from "react-native-gesture-handler";

const DetailContainer = ({ bookId }: { bookId: string }) => {
  const bookActions = useBookActions();
  const bookDetails = useMemo(
    () => bookActions.getBookDetail(bookId),
    [bookId]
  );
  return (
    <ScrollView className="flex mx-1 my-2">
      <View className="flex-row space-x-2">
        <BookImage imageURL={bookDetails.imageURL} width={150} />
        <View className="flex-wrap flex-1 items-start flex-grow">
          <View className="flex-row">
            <Text className="text-center font-bold flex-grow">
              {" "}
              {bookDetails.author}
            </Text>
          </View>
          <Text className="">{bookDetails.title}</Text>
        </View>
      </View>
      {/* <View className="p-1 h-20">
        <Text className="text-xs">{bookDetails.description}</Text>
      </View> */}
      <View
        // style={{ flex: 1, height: 200 }}
        className="flex-1, h-[200]  mt-2"
      >
        <ScrollView style={{ overflow: "scroll" }}>
          <Text style={{ fontSize: 16 }}>{bookDetails.description}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default DetailContainer;
