import { useEffect, useState } from "react";

export function useUrl() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  return currentUrl ? new URL(currentUrl) : null;
}
