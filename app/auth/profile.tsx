import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import CONSTANTS from '../constant';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const ProfilePage = () => {
    const API_URL = CONSTANTS.BASE_URL;

    const [isEditable, setIsEditable] = useState(true);
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        address: '',
        username: '',
        dob: '',
        phone: '',
        gender: '',
        pin: '',
        district: '',
        type: '',
    });

    // Fetch user details
    const userDetails = async () => {
        try {
            let storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) return;

            const response = await axios.get(`${API_URL}/user-details?id=${storedUserId}`);
            if (response.data) {
                setUserData(response.data);
            }
        } catch (error) {
            console.error("Error fetching user details", error);
        }
    };

    // Handle input change
    const handleChange = (field: string, value: string) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // Handle Save action
    const handleSave = async () => {
        try {
            let storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) return;
            const formData = new FormData();
            formData.append('firstname', userData.firstname);
            formData.append('lastname', userData.lastname);
            formData.append('address', userData.address);
            formData.append('email', userData.username);
            formData.append('dob', userData.dob);
            formData.append('phone', userData.phone);
            formData.append('gender', userData.gender);
            formData.append('pin', userData.pin);
            formData.append('district', userData.district);
            formData.append('type', userData.type);
            const response = await axios.put(`${API_URL}/update-user/${storedUserId}`, userData);
            //if (response.status === 204 || response.status === 204) {
            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your profile has been updated successfully!'
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
    };

    useEffect(() => {
        userDetails();
    }, []);

    return (
        <View style={styles.container}>
            {[
                { label: 'First Name', key: 'firstname' },
                { label: 'Last Name', key: 'lastname' },
                { label: 'Email', key: 'username' }, // Username should always be non-editable
                { label: 'Mobile', key: 'phone' },
                { label: 'Address', key: 'address' },
                { label: 'District', key: 'district' },
                { label: 'Pin', key: 'pin' }
            ].map((item) => (
                <View key={item.key} style={styles.inputContainer}>
                    <Text style={styles.label}>{item.label}</Text>
                    <TextInput
                        style={styles.input}
                        value={userData[item.key] ?? ''} // Ensure it's never undefined
                        onChangeText={(value) => handleChange(item.key, value)}
                        editable={item.key !== 'username' ? isEditable : false}
                    />
                </View>
            ))}

            {/* Toggle Edit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>{'Edit Profile'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProfilePage;
