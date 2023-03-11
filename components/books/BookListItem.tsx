import { Link } from "expo-router";
import { View, Text, Image } from "react-native";
import { Book } from "../../data/types";

type Props = {
  book: Book;
};
const BookListItem = ({ book }: Props) => {
  return (
    <View>
      <Link href={`/books/${book.title}-${book.author}`}>
        <Image
          key={book._id}
          source={{ uri: book.imageURL }}
          style={{ width: 175, height: 200 }}
        />
      </Link>
    </View>
  );
};

export default BookListItem;
