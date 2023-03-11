import {
  loadFromAsyncStorage,
  saveToAsyncStorage,
  mergeToAsyncStorage,
  removeFromAsyncStorage,
} from "./asyncStorage";

import uuid from "react-native-uuid";

/**
 * getKeys - generates keys for use in Async Storage
 *
 * @param {string} uid - uid for current user
 * @param {string} key - key that you are trying to create
 * @returns
 */

type StorageKeys =
  | "lastStoredDate"
  | "tagData"
  | "settings"
  | "savedFilters"
  | "dropboxToken";

function getKey(uid: string, key: StorageKeys) {
  const baseKeys = {
    lastStoredDate: "last_stored_date",
    tagData: "tag_data",
    settings: "settings",
    savedFilters: "saved_filters",
    dropboxToken: "dropbox_token",
  };
  return `${uid}-${baseKeys[key]}`;
}

//--======================
//-- Loading Data routines
//--======================
export type User = {
  uid: string;
  username: string;
};

export const generateUserObject = (username: string): User => {
  return {
    uid: uuid.v4() as string,
    username,
  };
};
/**
 * loadUsersFromStorage - Loads stored users from storage
 */

export const loadUsersFromStorage = async (): Promise<User[]> => {
  return loadFromAsyncStorage("Users");
};

/**
 * loadCurrentUserFromStorage - Loads the current active user from storage
 */
export const loadCurrentUserFromStorage = async (): Promise<User> => {
  return loadFromAsyncStorage("CurrentUser");
};

//--======================
//-- Saving Data routines
//--======================

/**
 * saveUsersToStorage - saves users data to local storage
 *
 * @param {Users} users - users array to store to storage
 */
export const saveUsersToStorage = async (users: User[]): Promise<void> => {
  await saveToAsyncStorage("Users", users);
};

/**
 * saveCurrentUserToStorage - Saves the currently active user to storage
 */
export const saveCurrentUserToStorage = async (
  currentUser: User
): Promise<void> => {
  await saveToAsyncStorage("CurrentUser", currentUser);
};
