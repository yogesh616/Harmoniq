import React, { useState, createContext, useContext } from "react";

const SleepContext = createContext();

export const SleepProvider = ({ children }) => {
    const [time, setTime] = useState(null);
    return (
        <SleepContext.Provider value={{ time, setTime }}>
            {children}
        </SleepContext.Provider>
    );
};

export const useSleep = () => useContext(SleepContext);
