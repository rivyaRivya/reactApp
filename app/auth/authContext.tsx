import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export const AuthContext = createContext();
import axios from "axios";
import CONSTANTS from "../constant";

const url = CONSTANTS.BASE_URL;
const API_URL = `${url}`;


export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(""); // "normal" or "driver"
    const [cartCount, setCartCount] = useState(0);
    const navigation = useNavigation();
    useEffect(() => {
        const checkLoginStatus = async () => {
            const userId = await AsyncStorage.getItem("userId");
            const storedUserType = await AsyncStorage.getItem("userType");

            getCartCount(userId);
            setIsLoggedIn(!!userId);
            setUserType(storedUserType || "");
        };
        checkLoginStatus();
    }, []);

    const getCartCount = async (id) => {
            try {
                const response = await axios.get(`${API_URL}/counts/${id}`); // Sample API
                setCartCount(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
            } 
    }
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
    const updateCount = async (count) => {
        setCartCount(count);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, userType, login, logout, cartCount, updateCount }}>
            {children}
        </AuthContext.Provider>
    );
};
