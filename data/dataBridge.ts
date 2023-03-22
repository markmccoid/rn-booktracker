import { loadFromAsyncStorage, mergeToAsyncStorage } from "./asyncStorage";
// import { getAndStoreBooksToStorage } from "./bookData";
import { BookUserData, BookUserDataStorage, DBBook, User } from "./types";

//---------------------------------------------
//-- Save USER BOOK DATA
//---------------------------------------------
export const saveUserBookData = async (
  bookId: string,
  userBookData: BookUserData
) => {
  const currentUser = await getCurrentUser();
  if (currentUser?.uid) {
    const mergedData = { [bookId]: { ...userBookData } };
    // @ts-ignore
    await mergeToAsyncStorage(`${currentUser.uid}-bookUserData`, mergedData);
  }
};

//---------------------------------------------
//-- Load USER BOOK DATA
//---------------------------------------------
export const loadUserBookData = async () => {
  const currentUser = await getCurrentUser();
  console.log("current user", currentUser);
  if (currentUser?.uid) {
    // @ts-ignore
    const userBookData = await loadFromAsyncStorage(
      `${currentUser.uid}-bookUserData`
    );
    return userBookData;
  }
  return;
};

const getCurrentUser = async () => {
  const currentUser: User = await loadFromAsyncStorage("currentUser");
  if (!currentUser?.uid) {
    throw "No Current User Defined";
  }
  return currentUser;
};

//----------------------------------------------------
//-- Takes in book data from database in keyed form. { bookid: { book data }, ... }
//-- This is the form we save to local storage in
//-- The function then merges in any of the user;s bookUserData
//   Function runs onInitialize and dbReload
//----------------------------------------------------
export const initalizeBookData = async (booksKeyed: Record<string, DBBook>) => {
  const bookUserData = await loadUserBookData();
  // Merge user data with keyed books
  Object.keys(bookUserData || {}).forEach((key: string) => {
    booksKeyed[key] = { ...bookUserData[key], ...booksKeyed[key] };
  });
  // Take book object and turn into an array
  const books = Object.keys(booksKeyed).map((key) => booksKeyed[key]);
  return books;
};
