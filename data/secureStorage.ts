import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const DROPBOX_TOKEN = "DropboxToken";

export const storeDropboxToken = async (token: string) => {
  if (Platform.OS !== "web") {
    // Securely store the auth on your device
    SecureStore.setItemAsync(DROPBOX_TOKEN, token);
  }
};

export const getDropboxToken = async () => {
  const result = await SecureStore.getItemAsync(DROPBOX_TOKEN);
  return result;
};
