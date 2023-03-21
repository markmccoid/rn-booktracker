import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Filters, useAppliedFilters } from "./store";
import { Book } from "./types";
import Constants from "expo-constants";

const { mongoAPIKey } = Constants?.manifest?.extra;

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
    "api-key": mongoAPIKey,
  },
};
