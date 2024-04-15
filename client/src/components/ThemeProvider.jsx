/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className=" bg-white text-gray-700 dark:text-white dark:bg-[#02021a] min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
