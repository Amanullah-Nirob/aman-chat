import React, { CSSProperties } from "react";

export const memoize = (func:Function) => {

  const cachedResults:any = {};
  return (...args:any) => {
    const argsKey = JSON.stringify(args);
    // Retrieve result from cache if present, else calculate
    const result = cachedResults[argsKey] || func(...args);
    // If result isn't saved in cache, save it for later use
    if (!cachedResults[argsKey]) cachedResults[argsKey] = result;

    return result;
  };
};


// Truncate a sentence/string
export const truncateString = memoize((str:string, limit:number, index:number) => {
  if (!str || !limit || !index) return "";
  return str.length > limit ? `${str.substring(0, index)}...` : str;
});


export function useHover(styleOnHover: CSSProperties, styleOnNotHover: CSSProperties = {}) {
  const [style, setStyle] = React.useState(styleOnNotHover);
  const onMouseEnter = () => setStyle(styleOnHover)
  const onMouseLeave = () => setStyle(styleOnNotHover)
  return {style, onMouseEnter, onMouseLeave}
}


export const isImageFile = memoize((filename:any) =>
  /(\.png|\.jpg|\.jpeg|\.svg|\.webp)$/.test(filename)
);

// In bytes
export const ONE_KB = 1024;
export const ONE_MB = 1048576;
export const TWO_MB = 2097152;
export const FIVE_MB = 5242880;