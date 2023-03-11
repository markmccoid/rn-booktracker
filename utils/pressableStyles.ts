export const touchablePress = ({ pressed }: { pressed: boolean }) => {
  return [
    {
      opacity: pressed ? 0.2 : 1,
      backgroundColor: "#2277ee",
    },
  ];
};
