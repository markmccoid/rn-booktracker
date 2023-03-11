import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { getAllBooks } from "./bookData";
import {
  loadCurrentUserFromStorage,
  saveCurrentUserToStorage,
  User,
} from "./localData";
import { Book } from "./types";
import { useFilteredBooks } from "./useFilteredBooks";

interface BookState {
  books: Book[];
}

async function getBooksFromDB() {
  return await getAllBooks();
}
//------------------------------------------------------------
//-- AUTH STORE
//------------------------------------------------------------
interface AuthState {
  currentUser: User | undefined;
  logUserIn: (user: User) => void;
  logUserOut: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: undefined,
  logUserIn: async (user) => {
    const resp = await saveCurrentUserToStorage(user);
    set({ currentUser: user });
  },
  logUserOut: () => set({ currentUser: undefined }),
}));
//~~~~~~~~~~~~~~
//~~ Auth Store Exports
//~~~~~~~~~~~~~~
export const useLogUserIn = () => useAuthStore((state) => state.logUserIn);
export const useLogUserOut = () => useAuthStore((state) => state.logUserOut);
export const useCurrentUser = () => useAuthStore((state) => state.currentUser);

//------------------------------------------------------------
//-- FILTER STORE
//------------------------------------------------------------
export type Filters = {
  primaryCategory?: string;
  secondaryCategory?: string;
  author?: string;
  title?: string;
};

interface FilterState {
  applied: Filters | undefined;
  actions: {
    addFilter: (filter: Filters) => void;
  };
}

const useFilterStore = create<FilterState>((set) => ({
  applied: {},
  actions: {
    addFilter: (filter) => {
      set((state) => ({ applied: { ...state.applied, ...filter } }));
    },
  },
}));

export const useAppliedFilters = () => useFilterStore((state) => state.applied);
export const useFilterActions = () => useFilterStore((state) => state.actions);

//------------------------------------------------------------
//-- BOOK STORE
//------------------------------------------------------------
export const useBookStore = create<BookState>((set, get) => ({
  books: [],
}));

export const onInitialize = async () => {
  const currentUser = await loadCurrentUserFromStorage();
  // const books = await useFilteredBooks();
  const books = [];
  useAuthStore.setState((state) => {
    if (currentUser?.uid) {
      // This would be where we load the user specific data into the store
    }
    return { currentUser };
  });
  useBookStore.setState((state) => ({
    books,
  }));
  return currentUser;
};
