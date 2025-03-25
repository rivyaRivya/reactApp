import axios from "axios";
import React, { useContext, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
<<<<<<< HEAD
=======
import { AuthContext } from "./authContext";
import { navigate } from "./navigationService";
import { DrawerActions } from "@react-navigation/native";
>>>>>>> 232f2b30789215019ba3b3c1408322e889403482
import CONSTANTS from "../constant";

const LoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const url = CONSTANTS.BASE_URL;
    const API_URL = `${url}`;

    const handleLogin = async () => {
        if (email !=null && password !=null) {
            Alert.alert("Login Successful", "Welcome back!");
            try {
                // Make an API call to the Spring Boot backend login endpoint
                const response = await axios.post(`${API_URL }/login`, {
                    email,
                    password,
                });

                // Handle successful login (e.g., save token to local storage or redirect)
                if (response) {
                    console.log(response.data);
                    if (!response.data) {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: 'Login failed,Invalid user credential!',
                        });
                    } else {
                        if (response.data) {
                            await AsyncStorage.setItem('userId', response.data.id.toString()); // Store userId
                            await AsyncStorage.setItem('userType', response.data.type.toString() === "user" ? "true" : "false"); // Store userId
                            await login(response.data.id, response.data.type); 
                            console.log('User ID saved:', response.data);
                            Toast.show({
                                type: 'success',
                                text1: 'Success',
                                text2: 'Login successful!',
                            });
                            if (response.data.type === "user")
                                navigation.navigate("Home");
                            else {
                                navigation.dispatch(DrawerActions.jumpTo("Orders"));
                                console.log("hhhhhhh")
                                //navigation.navigate("Orders");
                                //navigate("Orders", {});
                            }
                        }
                        
                    }
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Login failed! Invalid credentials.!',
                });
            }
        } else {
            Alert.alert("Login Failed", "Invalid credentials");
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.title}>Login</Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />

            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                Login
            </Button>

            <Text style={styles.registerText} onPress={() => navigation.navigate("Register")}>
                Don't have an account? Sign Up
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
    registerText: {
        marginTop: 20,
        textAlign: "center",
        color: "blue",
    },
});

export default LoginScreen;
