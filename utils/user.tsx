import React, { createContext, useEffect, useContext, useState } from "react";
import fetch from "isomorphic-unfetch";

let userState;

const User = createContext({ user: null, loading: false });

export const fetchUser = async () => {
    if (userState !== undefined) {
        return userState;
    }

    const res = await fetch("/api/me");
    userState = res.ok ? await res.json() : null;
    return userState;
};

export const UserProvider = ({ value, children }) => {
    const { user } = value;

    useEffect(() => {
        if (!userState && user) {
            userState = user;
        }
    }, []);

    return <User.Provider value={value}>{children}</User.Provider>
};

export const useUser = () => useContext(User);

export const useFetchUser = () => {
    const [data, setUser] = useState({ user: userState || null, loading: userState === undefined });

    useEffect(() => {
        if (userState !== undefined) {
            return;
        }

        let isMounted = true;

        fetchUser().then(user => {
            if (isMounted) {
                setUser({ user, loading: false });
            }
        });

        return () => {
            isMounted = false;
        }
    }, [userState]);

    return data;
}