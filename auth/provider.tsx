import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { getAllBooks } from "../data/bookData";
import { loadCurrentUserFromStorage, User } from "../data/localData";
import { useBookStore } from "../data/store";
import { Book } from "../data/types";
import { authRoute, homeRoute } from "../utils/routeConsts";
const AuthContext = React.createContext<{
  signIn: (user: User) => void;
  signOut: () => void;
  username: User | undefined;
}>({});

//~ ---------------------------------------------
//~ This hook can be used to access the user info.
//~ ---------------------------------------------
export function useAuth() {
  return React.useContext(AuthContext);
}

//~ ---------------------------------------------
//~ INTERNAL This hook will protect the route access
//~ based on user authentication.
//~ ---------------------------------------------
export const useProtectedRoute = (user: boolean) => {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(authNav)";

    //-- This first if makes sure if the "user" is not logged in and NOT in
    //-- the (authNav) route, then redirect to the sign-in page.
    //-- We check the "inAuthGroup" so we don't redirect if they are in a different
    //-- Auth flow like,"forgot password" or "Sign Up"
    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace(authRoute);
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      console.log("router tabs");
      router.replace(homeRoute);
      // router.replace("(main)");
    }
  }, [user, segments]);
};

function useBooks() {
  const [books, setBooks] = React.useState([] as Book[] | []);
  useEffect(() => {
    const getBooks = async () => {
      console.log("calling get books");
      const books = await getAllBooks();
      setBooks(books);
    };
    getBooks();
  }, []);
  return books;
}
//~ ----------------------------------------
//~ Provider - wraps application
//~ ----------------------------------------
type Props = React.PropsWithChildren;
export function Provider({ children }: Props) {
  /*
  Here we are simply setting a boolean (user) to indicate if we are "logged" in or not.
  For auth using something like TV Tracker, we would need to call a function (maybe hook)
  that returns an object with the following:
  {
    username: string; // If a value, then consider logged in
    availableUsernames: string[]; // stored in local storage all created users
    signIn: (username) => void // Sets the username value
    signUp: (username) => void // Adds a new user to local storage (updating availableUserNames)
    signOut: () => void  // Clears the username value
  }
  These 
  */
  // const [user, setAuth] = React.useState<boolean>(false);
  const currentUser = useBookStore((state) => state.currentUser);
  const logUserIn = useBookStore((state) => state.logUserIn);
  const logUserOut = useBookStore((state) => state.logUserOut);
  useProtectedRoute(!!currentUser?.uid);
  return (
    <AuthContext.Provider
      value={{
        signIn: (user: User) => logUserIn(user),
        signOut: logUserOut,
        username: currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
