/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export const useUpdateEffect = (cb: () => void, deps?: any[]) => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (!mount) {
      setMount(true);
    } else {
      cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
