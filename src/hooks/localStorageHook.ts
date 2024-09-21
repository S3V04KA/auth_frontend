import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useState } from "react";

const useLocalStorage = (key: string, initialValue: string | null) => {
  const [state, setState] = useState<string | null>(() => {
      const value = getCookie(key, {domain: process.env.DOMAIN});
      return value ? value : initialValue;
  });

  const setValue = (value: string | null) => {
      if (!value) {
        deleteCookie(key, {domain: process.env.DOMAIN});
        setState(value);
      }
      else {
        setCookie(key, value, {domain: process.env.DOMAIN});
        setState(value);
      }
  };

  return [state, setValue] as [string | null, (value: string | null) => void];
};

export default useLocalStorage;
