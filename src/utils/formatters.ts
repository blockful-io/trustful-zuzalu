export const getEllipsedAddress = (
  str: `0x${string}` | undefined,
  n: number = 6,
): string => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - (n - 2))}`;
  }
  return "Undefined Address";
};

const bytes32Regex = /^0x[0-9a-fA-F]{64}$/;
export function isBytes32(value: string): boolean {
  return bytes32Regex.test(value);
}

export const getReadableData = (data: number): string => {
  // Convert Unix timestamp to JavaScript Date object
  const date = new Date(data * 1000);

  // Format the date as a readable string
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return formattedDate;
};

export const formatTimeDifference = (
  startTime: number,
  endTime?: number,
): string[] => {
  let diff;
  if (!endTime) {
    // Get current time in milliseconds
    const now = Date.now();

    // Return a placeholder if the timestamp is in the future
    if (now - startTime * 1000 < 0) {
      return ["-", "-", "-", "-"];
    }

    // Calculate the difference
    diff = now - startTime * 1000;
  } else {
    diff = endTime * 1000 - startTime * 1000;
  }

  // Get all the time units
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return [String(days), String(hours), String(minutes), String(seconds)];
};
