import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Constants from "expo-constants";
import { makeRedirectUri } from "expo-auth-session";
import { authorize } from "react-native-app-auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDropboxActions } from "../../../data/store";
import { checkDropboxToken } from "../../../data/dropboxUtils";

import { Stack } from "expo-router";

const createConfig = (appSecret: string, redirectURL: string) => ({
  clientId: "l0rzqa2ib2p9dyp",
  clientSecret: appSecret,
  redirectUrl: redirectURL,
  scopes: [],
  serviceConfiguration: {
    authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
    tokenEndpoint: `https://www.dropbox.com/oauth2/token`,
  },
  additionalParameters: {
    token_access_type: "offline",
  },
});

type DropboxAuthInfo = {
  accessToken: string;
  accessTokenExpiration: Date;
  refreshToken: string;
  accountId: string | undefined;
  uid: string | undefined;
};
const dropboxAuth = () => {
  const [isTokenValid, setIsTokenValid] = React.useState(false);
  const dropboxActions = useDropboxActions();
  // -- Setup Vars for initial Authorization
  const APP_SECRET = Constants?.manifest?.extra?.dropboxSecret;
  const redirectURL = makeRedirectUri({
    scheme: "booktracker",
    path: "settings/dropboxAuth",
  });
  const config = createConfig(APP_SECRET, redirectURL);
  // ----------------------------------
  // Function to call on component mount to check if token
  // is valid.
  const checkToken = async () => {
    const token = await checkDropboxToken();
    setIsTokenValid(!!token);
  };

  React.useEffect(() => {
    checkToken();
  }, []);

  //------
  const authorizeDropbox = async () => {
    const authState = await authorize(config);
    const dropboxToken = authState?.accessToken;
    const dropboxExpireDate = Date.parse(authState?.accessTokenExpirationDate);
    const dropboxRefreshToken = authState?.refreshToken;
    const dropboxAccountId = authState?.tokenAdditionalParameters?.account_id;
    const dropboxUID = authState?.tokenAdditionalParameters?.uid;

    dropboxActions.updateDropboxAuth({
      dropboxToken,
      dropboxExpireDate,
      dropboxRefreshToken,
      dropboxAccountId,
      dropboxUID,
    });

    checkToken();
  };

  return (
    <View className="flex-1 flex-col items-center mt-10">
      <Stack.Screen
        options={{
          headerTitle: "Dropbox Authorization",
        }}
      />
      {isTokenValid && (
        <View className="">
          <Text className="text-center text-3xl">
            You have Authorized Dropbox
          </Text>
          <Text className="text-center text-2xl">You are good to go!</Text>
        </View>
      )}
      {!isTokenValid && (
        <View className="">
          <TouchableOpacity
            style={styles.authButton}
            onPress={authorizeDropbox}
          >
            <Text className="text-white">Authorize Dropbox</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  authButton: {
    backgroundColor: "#2A4EF8",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#213ec6",
  },
});
export default dropboxAuth;
