import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';  // Card and Button components from react-native-paper

const CartPage = () => {
    // Sample cart items
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            name: 'Wooden Dining Table',
            price: 299.99,
            quantity: 1,
            image: 'https://www.saajawat.com/cdn/shop/products/5bd32673618571c606550e27402802ab_1_1000x.webp?v=1676043265',
        },
        {
            id: '2',
            name: 'Wooden Chair',
            price: 99.99,
            quantity: 2,
            image: 'https://www.saajawat.com/cdn/shop/products/5bd32673618571c606550e27402802ab_1_1000x.webp?v=1676043265',
        },
    ]);

    // Function to remove item from the cart
    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Function to calculate the total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const renderItem = ({ item }) => (
        <Card style={styles.cartItem}>
            <View style={styles.cartItemContent}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.cartItemDetails}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>${item.price} each</Text>
                    <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
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
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cartList}
            />

            {/* Total Price Section */}
            <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceLabel}>Total Price:</Text>
                <Text style={styles.totalPrice}>${calculateTotal()}</Text>
            </View>

            {/* Checkout Button */}
            <Button mode="contained" style={styles.checkoutButton}>
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
});

export default CartPage;
