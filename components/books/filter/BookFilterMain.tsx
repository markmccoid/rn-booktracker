import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useAppliedFilters, useFilterActions } from "../../../data/store";

const BookFilterMain = () => {
  const filterActions = useFilterActions();
  const filters = useAppliedFilters();

  const [author, setAuthor] = useState(filters?.author || "");
  const [title, setTitle] = useState(filters?.title || "");
  return (
    <View>
      <Text>BookFilterMain</Text>
      <Text>FILTERS: {JSON.stringify(filters)}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Text>Author: </Text>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 4,
            marginVertical: 2,
            marginHorizontal: 5,
            flexGrow: 1,
          }}
          value={author}
          onChangeText={(e) => setAuthor(e)}
        />
        <Pressable onPress={() => filterActions.addFilter({ author })}>
          <Text>Add</Text>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Text>Title: </Text>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 4,
            marginVertical: 2,
            marginHorizontal: 5,
            flexGrow: 1,
          }}
          value={title}
          onChangeText={(e) => setTitle(e)}
        />
        <Pressable onPress={() => filterActions.addFilter({ title })}>
          <Text>Add</Text>
        </Pressable>
      </View>
      <Pressable
        style={{ padding: 5, margin: 2, borderWidth: 1 }}
        onPress={() => {
          filterActions.addFilter({
            primaryCategory: "Fiction",
            secondaryCategory: "SciFi",
          });
        }}
      >
        <Text>SciFi</Text>
      </Pressable>
      <Pressable
        style={{ padding: 5, margin: 2, borderWidth: 1 }}
        onPress={() => {
          filterActions.addFilter({
            primaryCategory: "Fiction",
            secondaryCategory: "Horror",
          });
        }}
      >
        <Text>Horror</Text>
      </Pressable>
    </View>
  );
};

export default BookFilterMain;
