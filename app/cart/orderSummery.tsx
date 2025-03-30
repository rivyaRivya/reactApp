import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, CheckBox, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // For icons
import CONSTANTS from "../constant";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const OrderSummary = ({navigation }) => {
    const [totalAmount, setTotalAmount] = useState(500); // Example total
    const [advanceAmount, setAdvanceAmount] = useState(200); // Example advance
    const [useCurrentAddress, setUseCurrentAddress] = useState(true);
    const [showAddressInput, setShowAddressInput] = useState(false);

    // Address Fields
    const [newAddress, setNewAddress] = useState("");
    const [district, setDistrict] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    const url = CONSTANTS.BASE_URL;
    const API_URL = `${url}`;
    const [cartItems, setCartItems] = useState([]);
    const [orderId, setOrderId] = useState(null);

    const [orders, setOrder] = useState({});


    const handleConfirmOrder = async () => {
        if (!orders.district || !orders.pin || !orders.address) {
            Toast.show({
                type: 'error',
                text1: 'Warning',
                text2: 'You must add your address before proceeding.!',
            });
            return;
        }
        const formData = new FormData();

        formData.append('status', "Confirmed");
        const response = await axios.put(`${API_URL}/update-status/${orderId}`, formData);
        if (response.status === 204 || response.status === 204) {
            Toast.show({
                type: 'success',
                text1: 'Booking Confirmed',
                text2: 'Your order booking successfully.Thank you!.'
            });
            navigation.navigate('Home');
        }
    };
    useEffect(() => {
        getOrderId();
    }, []);
    const getOrderId = async () => {
        try {
            let storedUserId = await AsyncStorage.getItem('userId');
            let numericUserId = parseInt(storedUserId, 10) || 0;
            console.log("User ID:", numericUserId);

            const response = await axios.get(`${API_URL}/get-orderId?id=${numericUserId}`);
            if (response.data !== 0) {
                setOrderId(response.data);
                listOrders(response.data);
            } 
        } catch (error) {
            console.error("Error fetching order ID:", error);
        }
    };

    // ✅ Function to fetch cart items
    const listOrders = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/get-orderDetails?id=${id}`);
            if (response.data) {
                console.log("Cart Data:", response.data.product);
                setCartItems(response.data.product);
                setOrder(response.data.order);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Shipping Details Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shipping To</Text>

                {useCurrentAddress ? (
                    <View>
                        <View style={styles.infoBox}>
                            <Ionicons name="location-outline" size={20} color="black" />
                            <Text style={styles.infoText}>{orders?.address ? orders.address : ""},{orders?.district ? orders.district : ""}, {orders?.pin ? orders.pin : ""}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Ionicons name="call-outline" size={20} color="black" />
                            <Text style={styles.infoText}>+91 {orders.mobile}</Text>
                        </View>
                        <View style={styles.infoBox}>
                            <Ionicons name="mail-outline" size={20} color="black" />
                            <Text style={styles.infoText}>{orders.email}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.addressContainer}>
                        <TextInput style={styles.input} placeholder="Enter New Shipping Address" value={newAddress} onChangeText={setNewAddress} />
                        <TextInput style={styles.input} placeholder="Enter District" value={district} onChangeText={setDistrict} />
                        <TextInput style={styles.input} placeholder="Enter Pin Code" value={pinCode} onChangeText={setPinCode} keyboardType="numeric" />
                        <TextInput style={styles.input} placeholder="Enter Contact Number" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" />
                    </View>
                )}

                <View style={styles.checkboxContainer}>
                    {/*<CheckBox value={useCurrentAddress} onValueChange={() => {*/}
                    {/*    setUseCurrentAddress(!useCurrentAddress);*/}
                    {/*    setShowAddressInput(!useCurrentAddress);*/}
                    {/*}} />*/}
                    {/*<Text style={styles.label}>Use Current Address as shipping address</Text>*/}
                </View>

                {!useCurrentAddress && (
                    <TouchableOpacity style={styles.updateButton} onPress={() => setShowAddressInput(true)}>
                        <Text style={styles.buttonText}>Update Shipping Address</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Order Details Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Details</Text>
                <View style={styles.infoBox}>
                    <Ionicons name="pricetag-outline" size={20} color="black" />
                    <Text style={styles.infoText}>Total Amount: ₹{orders.total_amount}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Ionicons name="wallet-outline" size={20} color="black" />
                    <Text style={styles.infoText}>Advance Amount: ₹{orders.advanced_amount}</Text>
                </View>
            </View>

            {/* Confirm Order Button */}
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
                <Text style={styles.confirmButtonText}>Confirm Order</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f8f9fa",
    },
    section: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3, // Adds shadow
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#6200EE",
    },
    infoBox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
        color: "#333",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        marginLeft: 10,
    },
    updateButton: {
        backgroundColor: "#6200EE",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    addressContainer: {
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    confirmButton: {
        backgroundColor: "#28a745",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
});

export default OrderSummary;
