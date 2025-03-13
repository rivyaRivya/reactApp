import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        if (email !=null && password !=null) {
            Alert.alert("Login Successful", "Welcome back!");
            navigation.navigate("Home");
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
