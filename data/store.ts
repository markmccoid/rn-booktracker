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
import { authRoute } from "../utils/routeConsts";
import {
  getDropboxRefreshToken,
  getDropboxToken,
  storeDropboxRefreshToken,
  storeDropboxToken,
} from "./secureStorage";
// import { useFilteredBooks } from "./useFilteredBooks";

//------------------------------------------------------------
//-- AUTH STORE
//------------------------------------------------------------
export type DropboxAuthObj = {
  dropboxToken: string;
  dropboxExpireDate: number;
  dropboxRefreshToken: string;
  dropboxAccountId: string;
  dropboxUID: string;
};
interface AuthState {
  currentUser: User | undefined;
  isLoggedIn: boolean;
  // dropboxToken: string | undefined;
  dropboxExpireDate: number;
  // dropboxRefreshToken: string | undefined;
  dropboxAccountId: string | undefined;
  dropboxUID: string | undefined;
  dropboxActions: {
    updateToken: (newToken: string, newExpireDate: number) => void;
    updateDropboxAuth: (dropboxAuthObj: Partial<DropboxAuthObj>) => void;
  };
}

const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: undefined,
  isLoggedIn: false,
  // dropboxToken: undefined,
  dropboxExpireDate: 0,
  // dropboxRefreshToken: undefined,
  dropboxAccountId: undefined,
  dropboxUID: undefined,
  dropboxActions: {
    async updateToken(newToken, newExpireDate) {
      useAuthStore.setState({ dropboxExpireDate: newExpireDate });
      if (newToken) await storeDropboxToken(newToken);
    },
    async updateDropboxAuth(dropboxAuthObj: Partial<DropboxAuthObj>) {
      useAuthStore.setState({ ...dropboxAuthObj });
      const state = useAuthStore.getState();
      const currDropBox = {
        // dropboxToken: state.dropboxToken,
        dropboxExpireDate: state.dropboxExpireDate,
        // dropboxRefreshToken: state.dropboxRefreshToken,
        dropboxAccountId: state.dropboxAccountId,
        dropboxUID: state.dropboxUID,
      };
      const resp = await saveToAsyncStorage("dropbox", currDropBox);
      if (dropboxAuthObj.dropboxRefreshToken)
        await storeDropboxRefreshToken(dropboxAuthObj.dropboxRefreshToken);
      if (dropboxAuthObj.dropboxToken)
        await storeDropboxToken(dropboxAuthObj.dropboxToken);
    },
  },
}));

export const useAuthUser = () => useAuthStore((state) => state.currentUser);
export const useDropboxExpireDate = () =>
  useAuthStore((state) => state.dropboxExpireDate);
export const useDropboxActions = () =>
  useAuthStore((state) => state.dropboxActions);
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
  // Get Dropbox Info
  const dropboxObj = await loadFromAsyncStorage("dropbox");
  useAuthStore.setState({ ...dropboxObj });
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
  favorite?: "include" | "exclude" | "inactive";
  listenedTo?: "include" | "exclude" | "inactive";
};
type CompareType = "equals" | "contains" | "bool" | "threeway";
type FiltersCompareTypes = {
  primaryCategory: CompareType;
  secondaryCategory: CompareType;
  author: CompareType;
  title: CompareType;
  source: CompareType;
  favorite: CompareType;
  listenedTo: CompareType;
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
  listenedTo: "threeway",
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
      if (filterValue === "inactive") return true;
      // if bookvalue = true
      if (bookValue) {
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

  // Log user in if exists
  if (currentUser) {
    await logUserIn(currentUser);
  }

  return currentUser;
};
