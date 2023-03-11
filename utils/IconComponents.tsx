import { Feather, FontAwesome } from "@expo/vector-icons";

export const BookTabIcon = (props) => (
  <Feather name="book" size={28} style={{ marginBottom: -3 }} {...props} />
);

export const TagsTabIcon = (props) => (
  <FontAwesome name="tags" size={28} style={{ marginBottom: -3 }} {...props} />
);

export const FilterIcon = (props) => (
  <FontAwesome name="filter" size={28} {...props} />
);
