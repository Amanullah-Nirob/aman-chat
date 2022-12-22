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


export function useHover(styleOnHover: CSSProperties,styleOnNotHover: CSSProperties = {},) {
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



export const getOneToOneChatReceiver = memoize((loggedInUser:any, chatUsers:any) => {
  if (!chatUsers?.length || !loggedInUser) return;
  return loggedInUser._id !== chatUsers[0]._id ? chatUsers[0] : chatUsers[1];
});


export const dateStringOf = memoize((date:any) => {
  return date
    ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    : "";
});



export const msgTimeStringOf = memoize((msgDate:any) => {
  if (!msgDate) return "";
  let hours = msgDate.getHours();
  let minutes = msgDate.getMinutes();
  const am_or_pm = hours >= 12 ? " pm" : " am";
  hours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}${am_or_pm}`;
});


// Impure function, so can't memoize
export const msgDateStringOf = (currDate:any) => {
  if (!currDate) return "";
  const months = [ "January", "February", "March", "April","May","June","July","August","September","October", "November","December"];
  const today = new Date();
  const yesterday = new Date(
    today.setTime(today.getTime() - 24 * 60 * 60 * 1000)
  );

  return dateStringOf(currDate) === dateStringOf(new Date())
    ? "Today"
    : dateStringOf(currDate) === dateStringOf(yesterday)
    ? "Yesterday"
    : `${currDate.getDate()} ${
        months[currDate.getMonth()]
      } ${currDate.getFullYear()}`;
};

// Convert a normal function to a 'debounced' function
export const debounce = (func:Function, delay = 500) => {
  let timer:any;
  return (...args:any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};


export const setCaretPosition = (node:any) => {
  node?.focus();
  const lastTextNode = node?.lastChild;
  if (!lastTextNode) return;
  const caret = lastTextNode.data?.length || 0;
  const range = document.createRange();
  range.setStart(lastTextNode, caret);
  range.setEnd(lastTextNode, caret);
  const sel:any = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

export const parseInnerHTML = (innerHTML: any) => {
  return (
    innerHTML
      ?.replaceAll("<br>", "")
      .replaceAll("&nbsp;", " ")
      .replaceAll("<div>", "")
      .replaceAll("</div>", "")
      .trim() || ""
  );
};

export const isImageOrGifFile = memoize((filename:any) =>
  /(\.png|\.jpg|\.jpeg|\.svg|\.gif|\.webp)$/.test(filename)
);

export const getAxiosConfig = (options:any) => {
  if (!options) return;
  const { loggedinUser, formData, blob } = options;
  const config:any = { headers: { "Content-Type": formData ? "multipart/form-data" : "application/json",}};
  if (blob) config.responseType = "blob";
  if (loggedinUser)
    config.headers.Authorization = `Bearer ${loggedinUser?.token}`;

  return config;
};


export const getFileSizeString = memoize((fileSize:any) => {
  return !fileSize
    ? ""
    : fileSize > ONE_MB
    ? (fileSize / ONE_MB).toFixed(1) + " MB"
    : fileSize > ONE_KB
    ? (fileSize / ONE_KB).toFixed(0) + " KB"
    : fileSize + " B";
});


export function toBoolean(env: string | undefined, initial: boolean) {
  if (typeof env !== 'undefined') {
    return env === 'true'
  }
  return initial
}