import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import BrowserContainer from "../../../../components/dropbox/filebrowser/BrowserContainer";
import { useDropboxToken } from "../../../../data/dropboxUtils";

const DropboxFiles = () => {
  const { token, tokenExpireDate } = useDropboxToken();
  console.log("TOKEN", token, tokenExpireDate);
  return <BrowserContainer />;
};

export default DropboxFiles;
