import axios from "axios";
import { Book } from "./types";

const data = JSON.stringify({
  collection: "Books",
  database: "audiobooktracker",
  dataSource: "Cluster0",
  filter: {
    primaryCategory: "Fiction",
    secondaryCategory: "SciFi",
  },
  limit: 5,
});

const config = {
  method: "post",
  url: "https://us-east-1.aws.data.mongodb-api.com/app/data-xyxuk/endpoint/data/v1/action/find",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key": "",
  },
  data: data,
};

export const getAllBooks = async (): Promise<Book[]> => {
  console.log("GETTING BOOK DATA");
  let books = [] as Book[];
  try {
    const holdBooks = await (await axios(config)).data;
    books = holdBooks.documents;
  } catch (error) {
    console.log("Axios Error getting books", error);
  }

  return books;
};
