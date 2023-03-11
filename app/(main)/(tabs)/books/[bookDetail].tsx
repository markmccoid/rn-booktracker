import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "../../../../auth/provider";
import { Stack, useSearchParams } from "expo-router";
import { useLogUserOut } from "../../../../data/store";

const BookDetail = () => {
  const logUserOut = useLogUserOut();

  const searchParams = useSearchParams();

  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: searchParams.bookDetail,
          headerRight: () => {
            return <Text>H</Text>;
          },
        }}
      />
      <Text>BookDetail</Text>
      <Button onPress={() => logUserOut()} title="Sign Out" />
    </View>
  );
};

export default BookDetail;
