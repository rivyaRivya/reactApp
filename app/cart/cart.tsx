import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import CONSTANTS from '../constant';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../auth/authContext';

const url = CONSTANTS.BASE_URL;
const API_URL = `${url}`;

const CartPage = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        getOrderId();
    }, []);

    // ✅ Function to get stored userId & fetch order details
    const getOrderId = async () => {
        try {
            let storedUserId = await AsyncStorage.getItem('userId');
            let numericUserId = parseInt(storedUserId, 10) || 0;
            console.log("User ID:", numericUserId);

            const response = await axios.get(`${API_URL}/get-orderId?id=${numericUserId}`);
            if (response.data !== 0) {
                setOrderId(response.data);
                listOrders(response.data);
            } else {
                setCartItems([]);
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
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    // ✅ Remove an item from the cart
    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        updateCart(id, "remove");
    };

    // ✅ Update quantity (increase or decrease)
    const updateQuantity = (id, change) => {
        setCartItems(cartItems.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + change) } // Prevent quantity < 1
                : item
        ));
        let type = "inc"
        if (change == -1)
            type = "dec"
        updateCart(id,type)
    };

    const updateCart = async (id,type) => {
        const storedUserId = await AsyncStorage.getItem('userId');
        const data = {
            productId: id,
            quantity: 1,
            userId: storedUserId,
            paymentStatus: "pending",
            advanced_amount: 500,
            orderDate: new Date(),
            orderStatus: "pending",
            total_amount: 0,
            type: type
        }
        const response = await axios.post(`${API_URL}/create-order`, data);
        if (response) {
            let message = "Product added to cart!";
            if (type == "dec")
                message = "1 item removed from cart!"
            else if (type == "remove")
                message = "Product removed from the cart!";
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: message,
            });
        }
    }
    // ✅ Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // ✅ Render cart item
    const renderItem = ({ item }) => (
        <Card style={styles.cartItem}>
            <View style={styles.cartItemContent}>
                <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.productImage} />
                <View style={styles.cartItemDetails}>
                    <Text style={styles.cartItemName}>{item.productname}</Text>
                    <Text style={styles.cartItemPrice}>₹{item.price} each</Text>

                    {/* Quantity Control */}
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.id, -1)}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.id, 1)}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.id)}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Your Cart</Text>

            {/* Cart Items */}
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.cartList}
            />

            {/* Total Price Section */}
            <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceLabel}>Total Price:</Text>
                <Text style={styles.totalPrice}>₹{calculateTotal()}</Text>
            </View>

            {/* Checkout Button */}
            <Button mode="contained" style={styles.checkoutButton} onPress={() => {
                if (cartItems.length > 0) {
                    navigation.navigate('OrderSummary');
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Warning',
                        text2: "Cart is empty,Please add products before proceeding to checkout.",
                    });
                }
            }}>
                Proceed to Checkout
            </Button>
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
    },
    cartList: {
        paddingBottom: 20,
    },
    cartItem: {
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
    },
    cartItemContent: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
        resizeMode: 'cover',
    },
    cartItemDetails: {
        flex: 1,
    },
    cartItemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cartItemPrice: {
        fontSize: 16,
        color: '#888',
    },
    cartItemQuantity: {
        fontSize: 14,
        color: '#555',
        marginHorizontal: 10,
    },
    removeButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    totalPriceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    totalPriceLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    checkoutButton: {
        marginTop: 20,
        paddingVertical: 15,
        backgroundColor: '#4caf50',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#f0f0f0',
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default CartPage;
