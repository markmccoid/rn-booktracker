import { Link } from "expo-router";
import { View, Text, Image, Pressable } from "react-native";
import { Book, BookUserData } from "../../data/types";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useBookActions } from "../../data/store";

type Props = {
  book: Book;
};
const BookListItem = ({ book }: Props) => {
  const { updateUserBookData } = useBookActions();
  const favStyle = book.favorite
    ? "border-red-700 border-2"
    : "border-blue-500 border";

  const onSetUserBookData = (updateField: keyof BookUserData, value: any) => {
    updateUserBookData(book._id, { [updateField]: value });
  };
  return (
    <View className={`${favStyle} m-3 mt-0`}>
      <Link href={`/books/${book._id}`}>
        <Image
          key={book._id}
          source={{ uri: book.imageURL }}
          style={{ width: 175, height: 200 }}
        />
      </Link>
      <Pressable onPress={() => onSetUserBookData("favorite", !book.favorite)}>
        {book.favorite ? (
          <Entypo name="heart" size={24} color="black" />
        ) : (
          <Entypo name="heart-outlined" size={24} color="black" />
        )}
      </Pressable>
      <Pressable
        onPress={() => onSetUserBookData("listenedTo", !book.listenedTo)}
      >
        {book.listenedTo ? (
          <Ionicons name="ear" size={24} color="black" />
        ) : (
          <Ionicons name="ear-outline" size={24} color="black" />
        )}
      </Pressable>
    </View>
  );
};

export default BookListItem;
