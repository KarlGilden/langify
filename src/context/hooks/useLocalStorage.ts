import React, { useState } from "react";

export const useLocalStorage = () => {
  const [value, setValue] = useState<string>("");

  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: string) => {
    const value = localStorage.getItem(key);
    if(typeof value === "string") setValue(value);
    return value;
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
    setValue("");
  };

  return { value, setItem, getItem, removeItem };
};