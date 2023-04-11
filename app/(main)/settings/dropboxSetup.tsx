import {
  View,
  Text,
  Pressable,
  Platform,
  Button,
  Linking,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  CodeChallengeMethod,
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";

import Constants from "expo-constants";
import { getAuthToken, listDropboxFiles } from "../../../data/dropboxUtils";
import {
  getDropboxToken,
  storeDropboxToken,
} from "../../../data/secureStorage";
import { useAuthPCKE } from "../../../data/store";
import { useSearchParams } from "expo-router";

// Step 1: Register your app with the Dropbox App Console
const APP_KEY = "l0rzqa2ib2p9dyp";
WebBrowser.maybeCompleteAuthSession();

const DropboxLinking = () => {
  const [authKey, setAuthKey] = useState<string>();
  const APP_SECRET = Constants?.manifest?.extra?.dropboxSecret;
  const authURL = `https://www.dropbox.com/oauth2/authorize?client_id=${APP_KEY}&response_type=code`;

  return (
    <View style={{ margin: 5 }}>
      <View className="flex flex-row items-center">
        <Text className="w-[60%]">
          Press and Authorize Dropbox - copy the Key shown and paste in box
          below
        </Text>
        <View className="items-center justify-end flex-grow">
          <TouchableOpacity
            className="p-2 border border-blue-400 rounded-md"
            style={{
              backgroundColor: "#3D9AE8",
              marginBottom: 10,
              alignItems: "center",
            }}
            onPress={() =>
              // () => WebBrowser.openBrowserAsync(authURL)
              WebBrowser.openBrowserAsync(
                `https://www.dropbox.com/oauth2/authorize?client_id=l0rzqa2ib2p9dyp&response_type=code`
              )
            }
          >
            <Text style={{ color: "white" }}>Go To Dropbox</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 5,
          backgroundColor: "#fff",
        }}
        value={authKey}
        onChangeText={(text) => setAuthKey(text)}
        placeholder="Enter Dropbox Code"
      />
      <TouchableOpacity
        className="p-2 border border-blue-400 rounded-md"
        style={{
          backgroundColor: `#3D9AE8${!!!authKey ? "aa" : ""}`,
          marginVertical: 10,
          alignItems: "center",
        }}
        disabled={!!!authKey}
        onPress={async () => {
          const token = await getAuthToken(authKey?.trim());
          if (!token?.error) {
            storeDropboxToken(token.token);
          } else {
            Alert.alert("ERROR getting Dropbox Token, Try again", token?.error);
          }
        }}
      >
        <Text style={{ color: "white" }}>Authorize</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DropboxLinking;

async function signInWithDropbox(APP_SECRET) {
  try {
    // Step 2: Install the react-native-app-auth package
    // const result = await authorize({
    //   clientId: APP_KEY,
    //   redirectUrl: "booktracker://",
    //   scopes: [
    //     "account_info.read",
    //     "files.metadata.read",
    //     "files.metadata.write",
    //   ],
    //   serviceConfiguration: {
    //     authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
    //     tokenEndpoint: "https://api.dropbox.com/oauth2/token",
    //   },
    // });

    const config = {
      clientId: APP_KEY,
      clientSecret: APP_SECRET,
      redirectUrl: "booktracker://settings/dropboxaccess",
      scopes: [
        "account_info.read",
        "files.metadata.read",
        "files.metadata.write",
      ],
      serviceConfiguration: {
        authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
        tokenEndpoint: `https://www.dropbox.com/oauth2/token`,
      },
      additionalParameters: {
        token_access_type: "offline",
      },
    };

    // Log in to get an authentication token
    const authState = await authorize(config);
    const dropboxUID = authState.tokenAdditionalParameters.account_id;

    console.log("dropbox access token", authState.accessToken);
    return authState.accessToken;
    // Step 5: Exchange the authorization code for an access token
    //const dropbox = new Dropbox({ accessToken: result.accessToken });
  } catch (error) {
    console.error(error);
    return `ERROR-${error}`;
  }
}
