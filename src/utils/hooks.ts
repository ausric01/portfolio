import { useEffect, useState } from "react";

export function useTimeout({
  time,
  callback,
}: {
  time: number;
  callback: () => void;
}) {
  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setExecuted(true);
      callback();
    }, time);

    return () => clearTimeout(timeout);
  }, [time]);

  return {
    executed,
    toggle: () => {
      setExecuted(!executed);
    },
  };
}
