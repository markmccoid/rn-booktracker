export type User = {
  uid: string;
  username: string;
};

export type Book = DBBook & BookUserData;

//~ Bokk read from MongoDB
export type DBBook = {
  _id: string;
  author: string;
  description: string;
  dropboxLocation: string;
  genres: string[];
  imageURL: string;
  pageCount: string;
  primaryCategory: string;
  publishedYear: number;
  releaseDate: Date;
  secondaryCategory: string;
  source: string;
  title: string;
  updatedAt: Date;
  createdAt: Date;
};

//~ User data for books stored in localstorage as Record<string, BookUserData>
//~  with the string key being the BookUserData _.id
type BookId = string;
export type BookUserDataStorage = Record<BookId, BookUserData>;
export type BookUserData = {
  favorite?: boolean;
  listenedTo?: boolean;
  rating?: number;
  note?: string;
  tags?: string[];
};
