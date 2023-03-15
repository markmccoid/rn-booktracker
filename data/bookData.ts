import { saveToAsyncStorage } from "./asyncStorage";
import { useBookStore } from "./store";
import axios from "axios";
import { Book, DBBook } from "./types";
import Constants from "expo-constants";
import keyBy from "lodash/keyBy";
import { initalizeBookData } from "./dataBridge";

const { mongoAPIKey } = Constants?.manifest?.extra;

const data = JSON.stringify({
  collection: "Books",
  database: "audiobooktracker",
  dataSource: "Cluster0",
  // filter: {
  //   primaryCategory: "Fiction",
  //   secondaryCategory: "SciFi",
  // },
  limit: 40,
});

const config = {
  method: "post",
  url: "https://us-east-1.aws.data.mongodb-api.com/app/data-xyxuk/endpoint/data/v1/action/find",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key": mongoAPIKey,
  },
  data: data,
};

const getAllBooks = async (): Promise<Book[]> => {
  let books = [] as Book[];
  try {
    const holdBooks = await (await axios(config)).data;
    books = holdBooks.documents;
  } catch (error) {
    console.log("Axios Error getting books", error);
  }

  return books;
};

export const refreshBooksFromDB = async () => {
  const books = await getAllBooks();

  const keyedBooks = keyBy(books, "_id");
  // console.log("keyed", keyedBooks);
  await saveToAsyncStorage("books", keyedBooks);
  const mergedBooks = await initalizeBookData(keyedBooks);
  useBookStore.setState({ books: mergedBooks });
};
