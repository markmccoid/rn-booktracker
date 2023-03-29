import { Link } from "expo-router";
import { View, Text, Image, Pressable } from "react-native";
import { Book, BookUserData } from "../../data/types";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useBookActions } from "../../data/store";
import BookImage from "./BookImage";

type Props = {
  book: Book;
};
const BookListItem = ({ book }: Props) => {
  const { updateUserBookData } = useBookActions();

  const onSetUserBookData = (updateField: keyof BookUserData, value: any) => {
    updateUserBookData(book._id, { [updateField]: value });
  };
  return (
    <View className={`mx-1 my-2 flex flex-row`}>
      {/* <View className="border border-black rounded-lg m-1"> */}
      <Link href={`/books/${book._id}`} asChild>
        <Pressable className="m-1">
          <BookImage
            imageURL={book.imageURL}
            ratio={book.source === "audible" ? 1 : undefined}
          />
        </Pressable>
      </Link>
      {/* BOOK Description Right Hand area */}
      <View className="flex flex-col flex-grow ">
        <View className="flex flex-col flex-grow">
          <View className="flex-row border-t border-blue-500">
            <Text className="flex-wrap flex-1 text-center text-base">
              {book.title}
            </Text>
          </View>
          <View className="flex-row mt-1">
            <Text className="flex-wrap flex-1 text-center text-sm">
              by {book.author}
            </Text>
          </View>
          <Text>{book.publishedYear}</Text>
        </View>
        <View className="flex-grow flex-row items-end justify-between mx-2 mb-2">
          <Pressable
            onPress={() => onSetUserBookData("listenedTo", !book.listenedTo)}
          >
            {book.listenedTo ? (
              <Ionicons name="ear" size={34} color="green" />
            ) : (
              <Ionicons name="ear-outline" size={34} color="black" />
            )}
          </Pressable>
          <Pressable
            onPress={() => onSetUserBookData("favorite", !book.favorite)}
          >
            {book.favorite ? (
              <Entypo name="heart" size={34} color="red" />
            ) : (
              <Entypo name="heart-outlined" size={34} color="black" />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default BookListItem;
