import { ActivityIndicator, View } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import { AuthContext, AuthProvider } from "./auth/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

// Import screens
import LoginScreen from "./auth/login";
import RegisterScreen from "./auth/register";
import HomePage from "./home/home";
import OrdersPage from "./driver/orders";
import ProductList from "./product/productlist";
import ProductDetails from "./product/productDetails";
import CartPage from "./cart/cart";
import ProfilePage from "./auth/profile";
import OrderDetailsPage from "./cart/orderDetails";

import { Ionicons } from '@expo/vector-icons';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
    const { isLoggedIn, userType, logout } = useContext(AuthContext);
    const [initialRoute, setInitialRoute] = useState("Home"); // Default to Home

    useEffect(() => {
        const checkUserType = async () => {
            const storedUserType = await AsyncStorage.getItem("userType");
            setInitialRoute(storedUserType === "driver" ? "Orders" : "Home"); // ✅ Dynamically set route
        };

        checkUserType();
    }, [isLoggedIn, userType]); // Re-run when login state changes

    if (!initialRoute) {
        return <ActivityIndicator size="large" color="blue" style={{ flex: 1, justifyContent: "center" }} />;
    }
    const handleLogout = (navigation) => {
        navigation.dispatch(DrawerActions.jumpTo("Login"));
        console.log("logout")
        logout
        //navigation.navigate("Login");
    }
    return (
        <Drawer.Navigator initialRouteName={initialRoute}>
            {!isLoggedIn ? (
                <>
                    <Drawer.Screen name="Home" component={HomePage} />
                    <Drawer.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Drawer.Screen name="Sign up" component={RegisterScreen} options={{ headerShown: false }} />
                </>
            ) : userType === "driver" ? (
                <>
                    <Drawer.Screen name="Orders" component={OrdersPage} />
                    <Drawer.Screen
                            name="Logout"
                            component={LoginScreen}
                        options={{ headerShown: false }}
                            listeners={({ navigation }) => ({ focus: () => handleLogout(navigation) })}
                    />
                </>
            ) : (
                <>
                    <Drawer.Screen name="Home" component={HomePage}
                    options={({ navigation }) => ({
                        title: 'Wood Connect',
                        headerStyle: {
                            backgroundColor: 'rgb(103, 80, 164)', // Background color of the header
                        },
                        headerTitleStyle: {
                            color: '#fff',
                            fontWeight: 'bold', // Title font weight
                        },
                        headerTintColor: '#fff',  
                        headerRight: () => (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                <Ionicons
                                    name="cart-outline"
                                    size={30}
                                    color="white"
                                    onPress={() => navigation.navigate('Cart')} // Navigate to the Cart Page
                                />

                            </View>
                        ),
                    })}/>
                    <Drawer.Screen name="Orders" component={OrdersPage} />
                    <Drawer.Screen name="Profile" component={ProfilePage} />
                    <Drawer.Screen
                                name="Logout"
                                component={LoginScreen}
                        options={{ headerShown: false }}
                                listeners={({ navigation }) => ({ focus: () => handleLogout(navigation) })}
                    />
                </>
            )}
        </Drawer.Navigator>
    );
}

export default function Index() {
    return (
        <AuthProvider>
                <Stack.Navigator
                    initialRouteName="Home" // ✅ Always load MyDrawer first
                    screenOptions={{
                        headerStyle: { backgroundColor: 'rgb(103, 80, 164)' },
                        headerTitleStyle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
                        headerTintColor: '#fff',
                        headerShown: true,
                    }}
                >
                    <Stack.Screen name="Home" component={MyDrawer} options={{ headerShown: false }} />
                    <Stack.Screen name="Product" component={ProductList} />
                    <Stack.Screen name="ProductDetails" component={ProductDetails} />
                    <Stack.Screen name="Cart" component={CartPage} />
                    <Stack.Screen name="OrderDetails" component={OrderDetailsPage} />
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            <Toast />
        </AuthProvider>
    );
}
