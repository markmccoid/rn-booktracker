import { View, Text, Pressable, Platform, Button } from "react-native";
import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  CodeChallengeMethod,
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
  exchangeCodeAsync,
} from "expo-auth-session";

// import * as Crypto from "expo-crypto";
// import base64 from "react-native-base64";

import Constants from "expo-constants";
import { getAuthToken, listDropboxFiles } from "../../../data/dropboxUtils";
import {
  getDropboxToken,
  storeDropboxToken,
} from "../../../data/secureStorage";
import { useSearchParams } from "expo-router";

// Step 1: Register your app with the Dropbox App Console
const APP_KEY = "l0rzqa2ib2p9dyp";

WebBrowser.maybeCompleteAuthSession();
// Endpoints
const discovery = {
  authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
  tokenEndpoint: "https://www.dropbox.com/oauth2/token",
};

const DropboxAccess = () => {
  const [accessToken, setAccessToken] = useState<string>();
  const APP_SECRET = Constants?.manifest?.extra?.dropboxSecret;
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "l0rzqa2ib2p9dyp",
      // Scopes are defined in the app itself in dropbox
      scopes: [],
      // Haven't figured out PKCE yet
      usePKCE: false,
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        scheme: "booktracker",
        path: "settings/dropboxaccess",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    const getToken = async () => {
      const storedToken = await getDropboxToken();
      setAccessToken(storedToken);
    };
    getToken();
  }, []);
  React.useEffect(() => {
    const storeToken = async (token: string) => {
      storeDropboxToken(token);
    };
    if (response?.type === "success") {
      const resp = response.params;
      const access_token = resp.access_token;
      setAccessToken(access_token);

      storeToken(access_token);
    }
  }, [response]);

  return (
    <View>
      <Text>DropboxAccess-</Text>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />

      <Text>AccessToken - {accessToken}</Text>
    </View>
  );
};

export default DropboxAccess;

/**
 
  // -!!!!! GET TOKEN, but SHORT LIVED!
 const DropboxAccess = () => {
  const [accessToken, setAccessToken] = useState<string>();
  const APP_SECRET = Constants?.manifest?.extra?.dropboxSecret;
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "l0rzqa2ib2p9dyp",
      // There are no scopes so just pass an empty array
      scopes: [],
      // Dropbox doesn't support PKCE
      usePKCE: false,
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        scheme: "booktracker",
        path: "settings/dropboxaccess",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    const getToken = async () => {
      const storedToken = await getDropboxToken();
      setAccessToken(storedToken);
    };
    getToken();
  }, []);
  React.useEffect(() => {
  
    const storeToken = async (token: string) => {
      storeDropboxToken(token);
    };
    if (response?.type === "success") {
      const resp = response.params;

      const access_token = resp.access_token;
      console.log("resp", resp, response.authentication);
      setAccessToken(access_token);

      storeToken(access_token);
    }
  }, [response]);

  return (
    <View>
      <Text>DropboxAccess-</Text>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
      
      <Text>AccessToken - {accessToken}</Text>
    </View>
  );
}; 
 */
