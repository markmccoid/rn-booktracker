import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Filters, useAppliedFilters } from "./store";
import { Book } from "./types";

const data = {
  collection: "Books",
  database: "audiobooktracker",
  dataSource: "Cluster0",
  limit: 10,
};

const config = {
  method: "post",
  url: "https://us-east-1.aws.data.mongodb-api.com/app/data-xyxuk/endpoint/data/v1/action/find",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Request-Headers": "*",
    "api-key": "",
  },
};

export const useFilteredBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const filters = useAppliedFilters();
  console.log("FILTERS", filters);
  const preppedFilters = prepFilters(filters);
  const dataString = {
    ...data,
    filter: { ...preppedFilters },
  };
  const configFinal = { ...config, data: JSON.stringify(dataString) };
  useEffect(() => {
    const getBooks = async () => {
      try {
        const holdBooks = await (await axios(configFinal)).data;
        setBooks(holdBooks.documents);
      } catch (error) {
        console.log("Axios Error getting books", error);
      }
    };
    getBooks();
  }, [filters]);

  return books;
};

function prepFilters(filters: Filters) {
  let catFilters = {};
  let textFilters = {};
  Object.keys(filters).forEach((el) => {
    if (el.includes("Category")) {
      catFilters = { ...catFilters, [el]: filters[el] };
    } else {
      textFilters = {
        ...textFilters,
        [el]: { $regex: `.*${filters[el]}.*`, $options: "i" },
      };
    }
  });
  return { ...catFilters, ...textFilters };
}
