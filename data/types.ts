export type Book = {
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
