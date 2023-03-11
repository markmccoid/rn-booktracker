import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../auth/provider";
import { Link } from "expo-router";
import {
  loadUsersFromStorage,
  User,
  saveUsersToStorage,
  generateUserObject,
} from "../../data/localData";
import { removeFromAsyncStorage } from "../../data/asyncStorage";
import { useLogUserIn } from "../../data/store";

const SignIn = () => {
  const [newUser, setNewUser] = useState("");
  const [allUsers, setAllUsers] = React.useState<User[] | []>([]);
  const logUserIn = useLogUserIn();

  //~~ User Add/delete functions
  const addNewUser = async () => {
    const newUserObj = generateUserObject(newUser);
    const newAllUsers = [newUserObj, ...allUsers];
    setAllUsers(newAllUsers);
    await saveUsersToStorage(newAllUsers);
  };

  const deleteUser = async (uid: string) => {
    const newAllUsers = allUsers.filter((el) => el.uid !== uid);
    setAllUsers(newAllUsers);
    await saveUsersToStorage(newAllUsers);
  };

  React.useEffect(() => {
    // Need the isMounted to handle "cancellation" of async
    // if onInitialize finds a "currentUser" and runs the login function
    let isMounted = true;
    const loadUsers = async (loggedIn: boolean) => {
      if (loggedIn) return;
      // setIsLoading(true);
      const loadedUsers = await loadUsersFromStorage();
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
        <Pressable
          onPress={addNewUser}
          style={{
            padding: 8,
            borderWidth: 1,
            margin: 2,
            backgroundColor: "blue",
          }}
        >
          <Text style={{ color: "white" }}>Add</Text>
        </Pressable>
      </View>
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
            <Pressable onPress={() => logUserIn(user)}>
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
      {/* <Button onPress={() => auth.signIn()} title="SIGN IN" /> */}
      <Link href="/books">Go To protected Route</Link>
      <Button
        onPress={() => removeFromAsyncStorage("Users")}
        title="CLear ALL Users"
      />
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
