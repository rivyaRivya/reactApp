import React, { useContext, useEffect, useState } from "react";
import { View, Button, Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { WebView } from "react-native-webview";

import CONSTANTS from '../constant';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../auth/authContext';

const PaymentScreen = ({ navigation }) => {

    const API_URL = CONSTANTS.BASE_URL;
    const { userType } = useContext(AuthContext);
    const [orderId, setOrderId] = useState(null);
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

    const userDetails = async () => {
        try {
            let storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) return;
            const response = await axios.get(`${API_URL}/user-details?id=${storedUserId}`);
            if (response.data) {
                setUserData(response.data);
                const response1 = await axios.get(`${API_URL}/get-orderId?id=${storedUserId}`);
                if (response1.data !== 0) {
                    setOrderId(response1.data);
                } 
            }
        } catch (error) {
            console.error("Error fetching user details", error);
        }
    };



    const handlePayment = async () => {
        console.log("hhhhh")
        const options = {
            description: "Purchase of Test Product",
            image: "https://your-logo-url.com/logo.png",
            currency: "INR",
            key: "rzp_test_7n3m2Cdf0J585n", // Replace with your Razorpay Key ID
            amount: 50000, // Amount in paise (₹500)
            name: "Woood connect",
            orderId: orderId,
            prefill: {
                email: userData.username,
                contact: userData.phone,
                name: userData.firstname + ' ' + userData.lastname,
            },
            theme: { color: "#F37254" },
        };
        try {
            RazorpayCheckout.open(options)
                .then((data) => {
                    console.log('Payment Success:', data);
                    successHandle();
                })
                .catch((error) => {
                    console.log('Payment Failed:', error);
                    alert(`Error: ${error.code} | ${error.description}`);
                });
        } catch (e) {
            console.error('Unexpected Error:', e);
        }
       

    };

    const successHandle = async () => {
        console.log("yyy");
        const formData = { status: "Confirmed" };
        try {
            const status = "Confirmed";
            const formData = new FormData();

            formData.append('status', status);
            console.log(orderId);
            await axios.put(`${API_URL}/update-status/${orderId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
         
                Toast.show({
                    type: 'success',
                    text1: 'Booking Confirmed',
                    text2: 'Your order booking successfully. Thank you!'
                });
                navigation.navigate('Home');
           
        } catch (error) {
            console.error('API Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to update booking',
                text2: 'Please try again later.'
            });
        }
    }
    useEffect(() => {
        userDetails();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Button title="Pay Advance amount : 500" onPress={handlePayment} />
        </View>
        //    <View style={{ flex: 1 }}>
      //<WebView source={{ uri: "https://your-razorpay-payment-url.com" }} />
    //</View>

    );
};

export default PaymentScreen;

