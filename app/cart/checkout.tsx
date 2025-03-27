import React from "react";
import { View, Button, Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { WebView } from "react-native-webview";
const PaymentScreen = () => {
    const handlePayment = () => {
        console.log("hhhhh")
        const options = {
            description: "Purchase of Test Product",
            image: "https://your-logo-url.com/logo.png",
            currency: "INR",
            key: "rzp_test_hLoSbQq7gnxAJY", // Replace with your Razorpay Key ID
            amount: 50000, // Amount in paise (₹500)
            name: "Your App Name",
            prefill: {
                email: "user@example.com",
                contact: "9876543210",
                name: "Test User",
            },
            theme: { color: "#F37254" },
        };

        //RazorpayCheckout.open(options)
        //    .then((data) => {
        //        Alert.alert("Payment Successful", `Payment ID: ${data.razorpay_payment_id}`);
        //    })
        //    .catch((error) => {
        //        Alert.alert("Payment Failed", `Error: ${error.code} | ${error.description}`);
        //    });
    };

    return (
        //<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        //    <Button title="Pay with Razorpay" onPress={handlePayment} />
        //</View>
            <View style={{ flex: 1 }}>
      <WebView source={{ uri: "https://your-razorpay-payment-url.com" }} />
    </View>

    );
};

export default PaymentScreen;
