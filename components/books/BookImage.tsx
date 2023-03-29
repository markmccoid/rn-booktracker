import { View, Image, StyleSheet } from "react-native";
import React from "react";

const RATIO = 128 / 193;
type Props = {
  imageURL: string;
  width?: number;
  ratio?: number;
};
const BookImage = ({ imageURL, width = 135, ratio = RATIO }: Props) => {
  const DB_WIDTH = width;
  const DB_HEIGHT = DB_WIDTH / ratio;
  if (!imageURL?.includes("http")) {
    return (
      <View
        style={{ width: DB_WIDTH, height: DB_HEIGHT }}
        className="border border-black rounded-lg"
      ></View>
    );
  }
  return (
    <View style={styles.shadow} className="rounded-lg">
      <Image
        resizeMode="stretch"
        source={{ uri: imageURL }}
        style={{ width: DB_WIDTH, height: DB_HEIGHT }}
        className="rounded-lg"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: "#000000",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
export default BookImage;
