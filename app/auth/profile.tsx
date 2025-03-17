import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';

const ProfilePage = () => {
    // Sample user data
    const user = {
        email: 'user@example.com',
        phone: '123-456-7890',
        address: '123 Main St, Springfield, IL'
    };

    const [isEditable, setIsEditable] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState(user.address);

    // Toggle the editable state
    const handleEditToggle = () => {
        setIsEditable(!isEditable);
    };

    // Handle Save action
    const handleSave = () => {
        // Here, you would typically send the updated data to the server
        // For now, we just show an alert
        Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
        setIsEditable(false); // Disable editing after saving
    };

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Profile</Text>

            {/* Email */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    editable={isEditable}
                    keyboardType="email-address"
                />
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    editable={isEditable}
                    keyboardType="phone-pad"
                />
            </View>

            {/* Address */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    editable={isEditable}
                />
            </View>

            {/* Edit/Save Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={isEditable ? handleSave : handleEditToggle}>
                <Text style={styles.buttonText}>{isEditable ? 'Save Changes' : 'Edit Profile'}</Text>
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
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
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
