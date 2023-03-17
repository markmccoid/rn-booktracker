import {
  CategoryMap,
  removeFromAsyncStorage,
  saveToAsyncStorage,
} from "./asyncStorage";
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
  limit: 4000,
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
  const bookMetadata = analyzeBooks(books);

  const keyedBooks = keyBy(books, "_id");
  // console.log("keyed", keyedBooks);
  await saveToAsyncStorage("books", keyedBooks);
  await removeFromAsyncStorage("bookMetadata");
  await saveToAsyncStorage("bookMetadata", bookMetadata);
  const mergedBooks = await initalizeBookData(keyedBooks);
  useBookStore.setState({ books: mergedBooks, bookMetadata });
};

//--------------------------------------
//-- Extract primaryCats, secondaryCats and Genres
//-- from passed books array
//--------------------------------------
// function analyzeBooks(books: DBBook[]) {
//   const primaryCategories = {};
//   const secondaryCategories = new Set();
//   const genres = new Set();

//   for (const book of books) {
//     primaryCategories[book.primaryCategory];
//     secondaryCategories.add(book.secondaryCategory);
//     book.genres.map((genre) => genres.add(genre));
//   }
//   return {
//     primaryCategories: Array.from(primaryCategories) as string[],
//     secondaryCategories: Array.from(secondaryCategories) as string[],
//     genres: Array.from(genres) as string[],
//   };
// }

function analyzeBooks(books: DBBook[]) {
  let categoryMap = {};
  const primaryCategories = new Set();
  const secondaryCategories = new Set();
  const genres = new Set();

  for (const book of books) {
    const currCat = book.primaryCategory;
    // Initialize each categories set or return the existing set
    categoryMap[currCat] = categoryMap[currCat]
      ? categoryMap[currCat]
      : new Set();
    // Add this books current secondaryCategory to its primary's set
    categoryMap[currCat] = categoryMap[currCat].add(book.secondaryCategory);
    // primaryCategories[book.primaryCategory] = [...primaryCategories[book.primaryCategory] || '', book.secondaryCategory];
    primaryCategories.add(book.primaryCategory);
    secondaryCategories.add(book.secondaryCategory);
    book.genres.map((genre) => genres.add(genre));
  }

  const categoryMapFinal: CategoryMap = Object.keys(categoryMap).reduce(
    (final, cat) => {
      final = { ...final, [cat]: Array.from(categoryMap[cat]) };
      return final;
    },
    {}
  );
  // console.log('FINAL', categoryMapFinal)
  return {
    primaryCategories: Array.from(primaryCategories) as string[],
    secondaryCategories: Array.from(secondaryCategories) as string[],
    categoryMap: categoryMapFinal,
    genres: Array.from(genres) as string[],
  };
}
