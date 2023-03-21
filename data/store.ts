import { FilterIcon } from "./../utils/IconComponents";
import { create } from "zustand";
import { shallow } from "zustand/shallow";
import {
  BookMetadata,
  loadFromAsyncStorage,
  removeFromAsyncStorage,
  saveToAsyncStorage,
} from "./asyncStorage";
import {
  initalizeBookData,
  loadUserBookData,
  saveUserBookData,
} from "./dataBridge";

import { Book, BookUserData, User } from "./types";
import { useEffect, useState } from "react";
// import { useFilteredBooks } from "./useFilteredBooks";

//------------------------------------------------------------
//-- AUTH STORE
//------------------------------------------------------------
interface AuthState {
  currentUser: User | undefined;
  isLoggedIn: boolean;
}

const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: undefined,
  isLoggedIn: false,
}));
//~~~~~~~~~~~~~~~~~~~
//~ Log IN and Log OUT functions
//~~~~~~~~~~~~~~~~~~~
// Looging in a user:
// 1. save the "user" to local storage as the "currentuser"
// 2. load all the books from local storage
// 3. merge user data with book data and store in bookStore
// 4. save current user and isLoggedIn flag to AuthStore
export const logUserIn = async (user: User) => {
  const resp = await saveToAsyncStorage("currentUser", user);
  const booksKeyed = await loadFromAsyncStorage("books");
  const bookMetadata = await loadFromAsyncStorage("bookMetadata");

  const books = await initalizeBookData(booksKeyed);
  useAuthStore.setState({ currentUser: user, isLoggedIn: true });
  useBookStore.setState({ books, bookMetadata });
};

export const logUserOut = async () => {
  useAuthStore.setState({ currentUser: undefined, isLoggedIn: false });
  useBookStore.setState({ books: [] });
  await removeFromAsyncStorage("currentUser");
};
//~~~~~~~~~~~~~~
//~~ Auth Store Exports
//~~~~~~~~~~~~~~
export const useCurrentUser = () => useAuthStore((state) => state.currentUser);
export const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);

//------------------------------------------------------------
//-- FILTER STORE
//------------------------------------------------------------
export type Filters = {
  primaryCategory?: string;
  secondaryCategory?: string;
  author?: string;
  title?: string;
};
type CompareType = "equals" | "contains" | "bool";
type FiltersCompareTypes = {
  primaryCategory: CompareType;
  secondaryCategory: CompareType;
  author: CompareType;
  title: CompareType;
};
interface FilterState {
  applied: Filters;
  filterCompareTypes: FiltersCompareTypes;
  actions: {
    addFilter: (filter: Filters) => void;
  };
}

const defaultFilterCompareTypes: FiltersCompareTypes = {
  primaryCategory: "equals",
  secondaryCategory: "equals",
  author: "contains",
  title: "contains",
};
const useFilterStore = create<FilterState>((set) => ({
  applied: {},
  filterCompareTypes: defaultFilterCompareTypes,
  actions: {
    addFilter: (filter) => {
      set((state) => ({ applied: { ...state.applied, ...filter } }));
      // const filteredBooks = getFilteredBooks();
      // useBookStore.setState({ filteredBooks: filteredBooks.books });
    },
  },
}));

export const useAppliedFilters = () => useFilterStore((state) => state.applied);
export const usefilterCompareTypes = () =>
  useFilterStore((state) => state.filterCompareTypes);
export const useFilterActions = () => useFilterStore((state) => state.actions);

//------------------------------------------------------------
//-- BOOK STORE
//------------------------------------------------------------
interface BookState {
  books: Book[];
  filteredBooks: Book[];
  currentBook: Book | undefined;
  bookMetadata: BookMetadata;
  actions: {
    getBookDetail: (bookId: string) => void;
    updateUserBookData: (bookId: string, userBookData: BookUserData) => void;
  };
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  filteredBooks: [],
  currentBook: undefined,
  bookMetadata: {
    categoryMap: {},
    primaryCategories: [],
    secondaryCategories: [],
    genres: [],
  },
  actions: {
    getBookDetail: (bookId: string) =>
      set((state) => ({
        currentBook: state.books.find((book) => book._id === bookId),
      })),
    updateUserBookData: async (bookId, userBookData) => {
      await saveUserBookData(bookId, userBookData);
      set((state) => {
        let newBooks = [];
        for (let book of state.books) {
          if (book._id === bookId) {
            const newBook = { ...book, ...userBookData };
            newBooks.push(newBook);
          } else {
            newBooks.push(book);
          }
        }
        return {
          books: newBooks,
        };
      });
    },
  },
}));

export const useBookActions = () => useBookStore((state) => state.actions);
//-- --------------------------------------------
//~ Filter Books
//-- --------------------------------------------
export const getFilteredBooks = () => {
  const filters = useFilterStore.getState().applied;
  const compareTypes = useFilterStore.getState().filterCompareTypes;
  const books = useBookStore.getState().books;

  let bookKeep: Book[] = [];

  for (const book of books) {
    if (bookKeep.length > 5000) {
      break;
    }
    bookKeep.push(book);
    for (const [filterFieldName, filterValue] of Object.entries(filters)) {
      const bookValue = book[filterFieldName];
      const compareType = compareTypes[filterFieldName];
      // returns bool based on if match
      const filterMatch = checkFilter(filterValue, bookValue, compareType);
      // If one of the filters for the books fails, the remove the book
      // from the array and continue with next book
      if (!filterMatch) {
        bookKeep.pop();
        break;
      }
    }
  }
  console.log("inGetFilteredBooks", bookKeep.length);
  // return { books: bookKeep, bookStats: getBooksStats(bookKeep) };
  return { books: bookKeep, bookStats: {} };
};
//!!!!!!!!!!!!!
export const useFilteredBooks = () => {
  const filters = useAppliedFilters();
  const compareTypes = usefilterCompareTypes();
  const books = useBookStore((state) => state.books);
  const [isLoading, setIsLoading] = useState(true);
  const [output, setOutput] = useState<Book[]>();

  useEffect(() => {
    setIsLoading(true);
    const actualFilter = () => {
      let bookKeep: Book[] = [];
      console.log("Start", new Date().getMilliseconds());
      for (const book of books) {
        if (bookKeep.length > 5000) {
          break;
        }
        bookKeep.push(book);
        for (const [filterFieldName, filterValue] of Object.entries(filters)) {
          const bookValue = book[filterFieldName];
          const compareType = compareTypes[filterFieldName];
          // returns bool based on if match
          const filterMatch = checkFilter(filterValue, bookValue, compareType);
          // If one of the filters for the books fails, the remove the book
          // from the array and continue with next book
          if (!filterMatch) {
            bookKeep.pop();
            break;
          }
        }
      }
      setOutput(bookKeep);
      setIsLoading(false);
    };
    const filterTimeout = async () => {
      setTimeout(actualFilter, 0);
    };
    const filterPromise = async () =>
      new Promise((resolve) => {
        setTimeout(() => {
          actualFilter();
          resolve(1);
        }, 1);
      });
    console.log("END", new Date().getMilliseconds());
    // const filter = async () => {
    //   // setTimeout(() => {}, 0);
    //   await asyncFilter();
    // };
    filterTimeout();
  }, [filters]);
  // let bookKeep: Book[] = [];
  // console.log("Start", new Date().getSeconds());
  // for (const book of books) {
  //   if (bookKeep.length > 5000) {
  //     break;
  //   }
  //   bookKeep.push(book);
  //   for (const [filterFieldName, filterValue] of Object.entries(filters)) {
  //     const bookValue = book[filterFieldName];
  //     const compareType = compareTypes[filterFieldName];
  //     // returns bool based on if match
  //     const filterMatch = checkFilter(filterValue, bookValue, compareType);
  //     // If one of the filters for the books fails, the remove the book
  //     // from the array and continue with next book
  //     if (!filterMatch) {
  //       bookKeep.pop();
  //       break;
  //     }
  //   }
  // }

  // return { books: bookKeep, bookStats: getBooksStats(bookKeep) };
  return { isLoading, books: output };
};

//!  NEED TO take into account if filter value is an array
//!  Maybe also if book value is an Array.  Genres and Tags will be arrays.
function checkFilter(
  filterValue: string | string[] | boolean,
  bookValue: string | string[] | boolean,
  compareType: CompareType
) {
  // Undefined filter values won't be checked.
  // If you send in a "false" for a bool check it wouldn't get through
  // So we add the explicit check for undefined.
  if (filterValue !== undefined) {
    // console.log('IN COMP', compareType, filterValue, bookValue, bookValue.includes(bookValue))
    if (compareType === "equals") {
      return filterValue === bookValue;
    }
    if (compareType === "contains") {
      if (typeof filterValue === "string" && typeof bookValue === "string") {
        return bookValue.toLowerCase().includes(filterValue.toLowerCase());
      }
    }

    if (compareType === "bool") {
      return filterValue === !!bookValue;
    }
  }
  return true;
}

//--------------------------------------
//~ Return stats on passed book array
//--------------------------------------
export function getBooksStats(books: Book[]) {
  let bookStats = {};
  for (const book of books) {
    bookStats = {
      ...bookStats,
      [book.author]: bookStats?.[book.author]
        ? bookStats?.[book.author] + 1
        : 1,
    };
  }
  return bookStats;
}

//------------------------------------------------------------
//-- INIT Function
//--  Performs initialization on app start
//--  1. check for current user and "log" user in
//--  2. Load books from local storage
//--  3. IF currentUser found THEN
//--      load user specific data from local storage
//------------------------------------------------------------

/**
 * Where does log user in intersect with intialize?
 * The log user in function needs to encapsulate more functionaliy
 * Not the keyed book loading, but the merging of book data with user data
 * We may JUST choose to LOAD book data again in the load user in
 */
export const onInitialize = async () => {
  const currentUser = await loadFromAsyncStorage("currentUser");
  // Log user in if exists
  if (currentUser) {
    await logUserIn(currentUser);
  }
  return currentUser;
};
