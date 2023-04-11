import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../auth/provider";
import { Link } from "expo-router";

import uuid from "react-native-uuid";
import {
  loadFromAsyncStorage,
  removeFromAsyncStorage,
  saveToAsyncStorage,
} from "../../data/asyncStorage";
import { logUserIn } from "../../data/store";
import { User } from "../../data/types";

/**
 * generateUserObject - helper function to create a userid (uid)
 * sends back a user object
 */
const generateUserObject = (username: string): User => {
  return {
    uid: uuid.v4() as string,
    username,
  };
};

const SignIn = () => {
  const [newUser, setNewUser] = useState("");
  const [allUsers, setAllUsers] = useState<User[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  //~~ User Add/delete functions
  const addNewUser = async () => {
    const newUserObj = generateUserObject(newUser);
    const newAllUsers = [newUserObj, ...allUsers];
    setAllUsers(newAllUsers);
    await saveToAsyncStorage("users", newAllUsers);
  };

  const deleteUser = async (uid: string) => {
    const newAllUsers = allUsers.filter((el) => el.uid !== uid);
    setAllUsers(newAllUsers);
    await saveToAsyncStorage("users", newAllUsers);
  };

  const onUserLogIn = async (user: User) => {
    setIsLoading(true);
    await logUserIn(user);
    setIsLoading(false);
  };
  React.useEffect(() => {
    // Need the isMounted to handle "cancellation" of async
    // if onInitialize finds a "currentUser" and runs the login function
    let isMounted = true;
    const loadUsers = async (loggedIn: boolean) => {
      if (loggedIn) return;
      // setIsLoading(true);
      const loadedUsers = await loadFromAsyncStorage("users");
      if (isMounted) {
        setAllUsers(loadedUsers || []);
        // setIsLoading(false);
      }
    };
    loadUsers(false);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          style={styles.input}
          value={newUser}
          onChangeText={(e) => setNewUser(e)}
        />
        <Pressable onPress={addNewUser}>
          <View
            style={{
              padding: 8,
              borderWidth: 1,
              margin: 2,
              backgroundColor: "blue",
            }}
          >
            <Text style={{ color: "white" }}>Add</Text>
          </View>
        </Pressable>
      </View>

      {/* Existing Users - Choosing will load DB */}
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <Text>Users</Text>
          <View>
            {allUsers.map((user) => (
              <View
                key={user.uid}
                style={{
                  flexDirection: "row",
                  borderWidth: 1,
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <Pressable onPress={() => onUserLogIn(user)}>
                  <Text style={{ padding: 8 }}>{user.username}</Text>
                </Pressable>
                <Pressable
                  onPress={() => deleteUser(user.uid)}
                  style={{ backgroundColor: "blue", padding: 8 }}
                >
                  <Text style={{ color: "white" }}>Delete</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </>
      )}
      {/* <Button onPress={() => auth.signIn()} title="SIGN IN" /> */}
      {!isLoading && (
        <>
          <Link href="/books">Go To protected Route</Link>
          <Button
            onPress={() => removeFromAsyncStorage("Users")}
            title="CLear ALL Users"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    width: "70%",
  },
});
export default SignIn;
