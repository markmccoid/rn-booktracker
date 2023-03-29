import {
  CategoryMap,
  loadFromAsyncStorage,
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
    // Loop through books and update any that don't have a published year
    // using the release date if available
    for (const book of books) {
      if (!book.publishedYear || book.publishedYear === 0) {
        if (book?.releaseDate) {
          book.publishedYear = new Date(book.releaseDate).getFullYear();
        }
      }
    }
  } catch (error) {
    console.log("Axios Error getting books", error);
  }

  return books;
};

//---------------------------------------------
//-- Load BOOK DATA
//---------------------------------------------
export const loadBookDataFromStorage = async () => {
  let books = await loadFromAsyncStorage("books");
  if (!books) {
    books = await getAndStoreBooksToStorage();
  }
  return books as Record<string, DBBook>;
};

//---------------------------------------------
//-- Get and Store books to storage from DB
//---------------------------------------------
export const getAndStoreBooksToStorage = async () => {
  const books = await getAllBooks();
  const keyedBooks = keyBy(books, "_id");
  await saveToAsyncStorage("books", keyedBooks);
  return books;
};

//---------------------------------------------
//-- REFRESH Books from DB
//---------------------------------------------
export const onRefreshBooksFromDB = async () => {
  const books = await getAndStoreBooksToStorage();
  const keyedBooks = keyBy(books, "_id"); //
  // const books = await getAllBooks(); //
  // await saveToAsyncStorage("books", keyedBooks); //

  const bookMetadata = analyzeBooks(books);
  await removeFromAsyncStorage("bookMetadata");
  await saveToAsyncStorage("bookMetadata", bookMetadata);
  const mergedBooks = await initalizeBookData(keyedBooks);
  // useBookStore.setState({ books: mergedBooks, bookMetadata });
  return { books: mergedBooks, bookMetadata };
};

//--------------------------------------
//~ Extract primaryCats, secondaryCats and Genres
//~ from passed books array
//--------------------------------------
function analyzeBooks(books: DBBook[]) {
  let categoryMap: Record<string, Set<string>> = {};
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

  return {
    primaryCategories: Array.from(primaryCategories) as string[],
    secondaryCategories: Array.from(secondaryCategories) as string[],
    categoryMap: categoryMapFinal,
    genres: Array.from(genres) as string[],
  };
}
