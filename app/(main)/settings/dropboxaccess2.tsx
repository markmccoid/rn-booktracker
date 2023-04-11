import { View, Text, Pressable, Platform, Button } from "react-native";
import React, { useState } from "react";
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

// Step 1: Register your app with the Dropbox App Console
const APP_KEY = "l0rzqa2ib2p9dyp";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
  tokenEndpoint: "https://www.dropbox.com/oauth2/token",
};
const useProxy = Platform.select({ web: false, default: true });

const DropboxAccess = () => {
  const [accessToken, setAccessToken] = useState<string>();
  const APP_SECRET = Constants?.manifest?.extra?.dropboxSecret;
  const redirectParam = makeRedirectUri({
    scheme: "com.mccoidco.booktracker",
    path: "settings/dropboxaccess",
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
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

  // React.useEffect(() => {
  //   const getToken = async () => {
  //     const storedToken = await getDropboxToken();
  //     setAccessToken(storedToken);
  //   };
  //   getToken();
  // }, []);
  React.useEffect(() => {
    const storeToken = async (token: string) => {
      storeDropboxToken(token);
    };
    if (response?.type === "success") {
      const resp = response.params;

      const code = resp.code;
      console.log("resp", resp, response.authentication);
      setAccessToken(code);

      // storeToken(access_token);
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
      {/* <Pressable
        style={{ borderWidth: 1, padding: 5 }}
        onPress={async () =>
          setAccessToken(await signInWithDropbox(APP_SECRET))
        }
      >
        <Text>Try Dropbox Access</Text>
      </Pressable> */}
      <Text>AccessToken - {accessToken}</Text>
    </View>
  );
};

export default DropboxAccess;

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
