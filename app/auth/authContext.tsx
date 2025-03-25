import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(""); // "normal" or "driver"
    const navigation = useNavigation();
    useEffect(() => {
        const checkLoginStatus = async () => {
            const userId = await AsyncStorage.getItem("userId");
            const storedUserType = await AsyncStorage.getItem("userType");

            setIsLoggedIn(!!userId);
            setUserType(storedUserType || "");
        };
        checkLoginStatus();
    }, []);

    const login = async (userId, type) => {
        await AsyncStorage.setItem("userId", userId.toString());
        await AsyncStorage.setItem("userType", type.toString());

        setIsLoggedIn(true);
        setUserType(type);
    };

    const logout = async () => {
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("userType");

        setIsLoggedIn(false);
        setUserType("");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
