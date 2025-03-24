// RegisterScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';


import axios from "axios";
import Toast from 'react-native-toast-message';
import CONSTANTS from '../constant';


const url = CONSTANTS.BASE_URL;
const API_URL = `${url}`;


// Validation schema
const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string()
        .matches(/^\d{10}$/, 'Mobile number should be 10 digits')
        .required('Mobile number is required'),
    password: Yup.string()
        .min(6, 'Password should be at least 6 characters')
        .required('Password is required'),
});

const RegisterScreen = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Formik
                initialValues={{ firstname: '', lastname: '', email: '', mobile: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    console.log(values);

                    try {
                        const formData = new FormData();
                        formData.append('firstname', values.firstname);
                        formData.append('lastname', values.lastname);
                        formData.append('email', values.email);
                        formData.append('phone', values.mobile);
                        formData.append('password', values.password);
                        formData.append('type', "user");
                        const response = await axios.post(`${API_URL}/user`, formData);
                        console.log("Response:", response.data);

                        // Show success message
                        Toast.show({
                            type: 'success',
                            text1: 'Success',
                            text2: 'Register successfully.Please login!',
                        });
                        navigation.navigate('Login');
                    } catch (error) {
                        console.error("Error submitting form:", error);
                        Toast.show({
                            type: 'error',
                            text1: 'Errro',
                            text2: 'Failed to register. Please try again!',
                        });
                    } 
                    // You can call your API or do further actions on successful form submission
                }}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                }) => (
                    <>
                        <TextInput
                            label="First name"
                            value={values.firstname}
                            onChangeText={handleChange('firstname')}
                            onBlur={handleBlur('firstname')}
                            error={touched.firstname && errors.firstname} 
                            style={styles.input}
                        />
                        {touched.firstname && errors.firstname && (
                            <Text style={styles.errorText}>{errors.firstname}</Text>
                        )}

                        <TextInput
                            label="Last name"
                            value={values.lastname}
                            onChangeText={handleChange('lastname')}
                            onBlur={handleBlur('firstname')}
                            error={touched.lastname && errors.lastname}
                            style={styles.input}
                        />
                        {touched.lastname && errors.lastname && (
                            <Text style={styles.errorText}>{errors.lastname}</Text>
                        )}

                        <TextInput
                            label="Email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            error={touched.email && errors.email}
                            keyboardType="email-address"
                            style={styles.input}
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}

                        <TextInput
                            label="Mobile"
                            value={values.mobile}
                            onChangeText={handleChange('mobile')}
                            onBlur={handleBlur('mobile')}
                            error={touched.mobile && errors.mobile}
                            keyboardType="phone-pad"
                            style={styles.input}
                        />
                        {touched.mobile && errors.mobile && (
                            <Text style={styles.errorText}>{errors.mobile}</Text>
                        )}

                        <TextInput
                            label="Password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            error={touched.password && errors.password}
                            secureTextEntry
                            style={styles.input}
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}

                        <Button mode="contained" onPress={() => {
                            handleSubmit();
                        }} style={styles.button}>
                            Register
                        </Button>
                    </>
                )}
            </Formik>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
});

export default RegisterScreen;
