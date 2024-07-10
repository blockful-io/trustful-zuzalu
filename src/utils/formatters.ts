export const getEllipsedAddress = (
  str: `0x${string}` | undefined,
  n: number = 6,
): string => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - (n - 2))}`;
  }
  return "Undefined Address";
};
