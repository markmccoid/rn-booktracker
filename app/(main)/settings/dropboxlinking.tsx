import {
  View,
  Text,
  Pressable,
  Platform,
  Button,
  Linking,
  TouchableOpacity,
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
  const searchParams = useSearchParams();
  console.log("SEARCH PARAMS", searchParams);
  const PKCE = useAuthPCKE();
  console.log("pcke", PKCE.challenge);
  console.log("VERIF", PKCE.verifier);
  const [accessToken, setAccessToken] = useState<string>();
  const APP_SECRET = Constants?.manifest?.extra?.dropboxSecret;
  const authURL =
    "https://www.dropbox.com/oauth2/authorize?client_id=l0rzqa2ib2p9dyp&response_type=code";

  const redirectURL = `&redirect_uri=${makeRedirectUri({
    scheme: "booktracker",
    path: "settings/dropboxlinking",
  })}`;

  // useEffect(() => {
  //   const test = async () => {
  //     const result = await Linking.openURL(authURL);
  //     console.log(result);
  //   };
  //   test();
  // }, []);

  // const [request, response, promptAsync] = useAuthRequest(
  //   {
  //     responseType: ResponseType.Token,
  //     clientId: "l0rzqa2ib2p9dyp",
  //     // There are no scopes so just pass an empty array
  //     scopes: [],
  //     // Dropbox doesn't support PKCE
  //     usePKCE: false,
  //     // For usage in managed apps using the proxy
  //     redirectUri: makeRedirectUri({
  //       scheme: "booktracker",
  //       path: "settings/dropboxaccess",
  //     }),
  //   },
  //   discovery
  // );

  // React.useEffect(() => {
  //   const getToken = async () => {
  //     const storedToken = await getDropboxToken();
  //     setAccessToken(storedToken);
  //   };
  //   getToken();
  // }, []);
  // React.useEffect(() => {
  //   const storeToken = async (token: string) => {
  //     storeDropboxToken(token);
  //   };
  //   if (response?.type === "success") {
  //     const resp = response.params;

  //     const access_token = resp.access_token;
  //     console.log("resp", resp, response.authentication);
  //     setAccessToken(access_token);

  //     storeToken(access_token);
  //   }
  // }, [response]);
  const openDropbox = async () => {
    const supported = await Linking.canOpenURL("dropbox://");

    if (supported) {
      Linking.openURL("dropbox://");
    } else {
      console.log("Dropbox app not installed.");
    }
  };

  // const PCKEURL = `&code_challenge=${PKCE.challenge}&code_challenge_method=S256`;
  const PCKEURL = `&code_challenge=tbiN58P9jg-YwWPbY0vKKEuPFwndmWvX5WkvI7uX5mI&code_challenge_method=S256`;
  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          marginBottom: 10,
          alignItems: "center",
        }}
        onPress={() =>
          WebBrowser.openBrowserAsync(
            `https://www.dropbox.com/oauth2/authorize?client_id=l0rzqa2ib2p9dyp&response_type=code${PCKEURL}`
          )
        }
      >
        <Text style={{ color: "white" }}>Go To Dropbox</Text>
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
