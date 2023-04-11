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

import { loadBookDataFromStorage, onRefreshBooksFromDB } from "./bookData";
import { Book, BookUserData, User } from "./types";
import { useEffect, useState } from "react";
import * as Crypto from "expo-crypto";
import base64 from "react-native-base64";
import orderBy from "lodash/orderBy";
// import { useFilteredBooks } from "./useFilteredBooks";

//------------------------------------------------------------
//-- AUTH STORE
//------------------------------------------------------------
interface AuthState {
  currentUser: User | undefined;
  isLoggedIn: boolean;
  PCKEChallenge: string | undefined;
  PCKEVerifier: string | undefined;
}

const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: undefined,
  isLoggedIn: false,
  PCKEChallenge: undefined,
  PCKEVerifier: undefined,
}));

export const useAuthUser = () => useAuthStore((state) => state.currentUser);
export const useAuthPCKE = () =>
  useAuthStore((state) => ({
    challenge: state.PCKEChallenge,
    verifier: state.PCKEVerifier,
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
  const booksKeyed = await loadBookDataFromStorage();
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
  source?: "dropbox" | "audible";
  favorite?: "include" | "exclude" | "off";
};
type CompareType = "equals" | "contains" | "bool" | "threeway";
type FiltersCompareTypes = {
  primaryCategory: CompareType;
  secondaryCategory: CompareType;
  author: CompareType;
  title: CompareType;
  source: CompareType;
};
type Sort =
  | "publishedYear"
  | "author"
  | "title"
  | "source"
  | "secondaryCategory";

export type AppliedSort = {
  sortField: Sort;
  displayName: string;
  sortDirection: "asc" | "desc";
  active: boolean;
  pos: number;
}[];
interface FilterState {
  applied: Filters;
  appliedSort: AppliedSort;
  filterCompareTypes: FiltersCompareTypes;
  actions: {
    addFilter: (filter: Filters) => void;
    setSort: (sort: AppliedSort) => void;
  };
}

const defaultFilterCompareTypes: FiltersCompareTypes = {
  primaryCategory: "equals",
  secondaryCategory: "equals",
  author: "contains",
  title: "contains",
  source: "equals",
  favorite: "threeway",
};

const defaultSort: AppliedSort = [
  {
    sortField: "publishedYear",
    displayName: "Pub Year",
    sortDirection: "desc",
    active: true,
    pos: 0,
  },
  {
    sortField: "author",
    displayName: "Author",
    sortDirection: "desc",
    active: true,
    pos: 1,
  },
  {
    sortField: "title",
    displayName: "Title",
    sortDirection: "desc",
    active: true,
    pos: 2,
  },
  {
    sortField: "source",
    displayName: "Source",
    sortDirection: "desc",
    active: true,
    pos: 3,
  },
];
const useFilterStore = create<FilterState>((set) => ({
  applied: {},
  appliedSort: defaultSort,
  filterCompareTypes: defaultFilterCompareTypes,
  actions: {
    addFilter: (filter) => {
      set((state) => ({ applied: { ...state.applied, ...filter } }));
      // const filteredBooks = getFilteredBooks();
      // useBookStore.setState({ filteredBooks: filteredBooks.books });
    },
    // currently need the full sort array
    setSort: (sort) => {
      set((state) => ({ appliedSort: sort }));
    },
  },
}));

export const useAppliedFilters = () => useFilterStore((state) => state.applied);
export const useAppliedSort = () =>
  useFilterStore((state) => state.appliedSort);
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
    getBookDetail: (bookId: string) => Book | undefined;
    updateUserBookData: (bookId: string, userBookData: BookUserData) => void;
    refreshBooksFromDB: () => void;
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
    getBookDetail: (bookId: string) => {
      const bookDetail = get().books.find((book) => book._id === bookId);
      set((state) => ({
        currentBook: bookDetail,
      }));
      return bookDetail;
    },
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
    refreshBooksFromDB: async () => {
      const newBooks = await onRefreshBooksFromDB();
      set((state) => newBooks);
    },
  },
}));

export const useBookActions = () => useBookStore((state) => state.actions);

//-- --------------------------------------------
//~ Filter Books
//-- --------------------------------------------
export const useFilteredBooks = () => {
  const filters = useAppliedFilters();
  const sort = useAppliedSort();
  const compareTypes = usefilterCompareTypes();
  const books = useBookStore((state) => state.books);
  const [isLoading, setIsLoading] = useState(true);
  const [booksFiltered, setBooksFiltered] = useState<Book[]>();

  useEffect(() => {
    console.log("FILTERING BOOKS - store.useFilteredBooks");
    setIsLoading(true);
    const actualFilter = () => {
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
      setBooksFiltered(bookKeep);
      setIsLoading(false);
    };
    const filterTimeout = async () => {
      setTimeout(actualFilter, 0);
    };

    filterTimeout();
  }, [filters, books]);
  //~ Prepare sort criteria
  type SortDir = { fields: string[]; directions: ("asc" | "desc")[] };
  const sortObject = sort
    .filter((el) => el.active)
    .reduce<SortDir>(
      (final, el) => ({
        fields: [...final.fields, el.sortField],
        directions: [...final.directions, el.sortDirection],
      }),
      { fields: [], directions: [] }
    );
  //~ Sort books with lodash's orderBy
  const sortedBooks = orderBy(
    booksFiltered,
    sortObject.fields,
    sortObject.directions
  );

  return {
    isLoading,
    books: sortedBooks,
    // bookStats: getBooksStats(booksFiltered || [r]),
  };
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
    if (compareType === "threeway") {
      // if includes then return only "true" favorites
      // if excludes then IF "true", do NOT return
      // if off, ignore, so return true
      if (filterValue === "off") return true;
      if (bookValue) {
        console.log("IN Filter", filterValue, bookValue);
        return filterValue === "include" ? true : false;
      }
      return filterValue === "include" ? false : true;
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
  //calculate PCKE Challenge
  // Generate a random string of 64 characters (43-128 recommended by OAuth2 spec)
  console.log("codeverifier");
  const codeVerifierInit = base64.encode(
    Array.from({ length: 64 }, () => Math.random().toString(36)[2])
      .join("")
      .substring(0, 128)
  );
  const codeVerifier = codeVerifierInit.replace(/=/g, "");
  console.log("codeverifier DONE", codeVerifier);
  const sha = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier
  );
  const codeChallengeInit = base64.encode(sha);
  const codeChallenge = codeChallengeInit.replace(/=/g, "");
  useAuthStore.setState({
    PCKEChallenge: codeChallenge,
    PCKEVerifier: codeVerifier,
  });

  // Log user in if exists
  if (currentUser) {
    await logUserIn(currentUser);
  }

  return currentUser;
};
