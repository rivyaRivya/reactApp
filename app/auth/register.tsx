// RegisterScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string()
        .matches(/^\d{10}$/, 'Mobile number should be 10 digits')
        .required('Mobile number is required'),
    password: Yup.string()
        .min(6, 'Password should be at least 6 characters')
        .required('Password is required'),
});

const RegisterScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Formik
                initialValues={{ username: '', email: '', mobile: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log(values);
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
                            label="Username"
                            value={values.username}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            error={touched.username && errors.username} 
                            style={styles.input}
                        />
                        {touched.username && errors.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
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

                        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
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
