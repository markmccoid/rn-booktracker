import "dotenv/config";
// import appjson from "./app.json";

// should be populated whether building
// for DEV or Prod
const mongoKey = process.env.MONGO_APIKEY;
const dropboxSecret = process.env.DROPBOX_SECRET;
export default {
  name: "Book Tracker",
  slug: "book-tracker",
  scheme: "booktracker",
  privacy: "unlisted",
  platforms: ["ios"],
  version: "0.1",
  orientation: "portrait",
  // icon: "./assets/TVTrackerIcon.png",
  // splash: {
  //   image: "./assets/TVTrackerSplash.png",
  //   resizeMode: "contain",
  //   backgroundColor: "#84ee4b",
  // },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    // Apple App Store Connect prompts you to select the type of encryption algorithm your app implements.
    // This is known as Export Compliance Information. It is asked when publishing the app or submitting for TestFlight.
    // The first setting takes care of this prompt
    usesNonExemptEncryption: false,
    supportsTablet: false,
    bundleIdentifier: "com.mccoidco.booktracker",
    buildNumber: "0.1",
    infoPlist: {
      RCTAsyncStorageExcludeFromBackup: false,
    },
  },
  // THIS IS WHAT WE READ IN THE CODE
  // uses the expo contstancs package
  extra: {
    mongoAPIKey: mongoKey,
    dropboxSecret: dropboxSecret,
    eas: {
      projectId: "bdea7e54-3c01-4787-91a8-c3b3adf709cd",
    },
  },
};
