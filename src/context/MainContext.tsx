import { createContext } from "react";

const initialContext: any = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "")
    : null,
};

export const MainContext = createContext(initialContext);
