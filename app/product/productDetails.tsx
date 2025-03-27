import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings'; // Importing the Rating component for star ratings
import axios from "axios";
import { Card, Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from "../constant";
import { AuthContext } from '../auth/authContext';

const ProductDetails = ({ route }) => {
    const { product } = route.params;
    const [loading, setLoading] = useState(true);
    const url = CONSTANTS.BASE_URL;
    const API_URL = `${url}`;
    const [products, setProduct] = useState(Object);
    const [quantity, setQuantity] = useState(1);
    const { updateCount } = useContext(AuthContext);

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    useEffect(() => {
        fetchProducts();
    }, []);

    const toCamelCase = (str) => {
        console.log(str)
        if (!str || typeof str !== 'string') return '';
        return str
            .toLowerCase()
            .split(' ')
            .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
            .join('');
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/product-details?id=${product.id}`); // Sample API
            setProduct(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };
    const addToCart = async () => {
        console.log("click")
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            console.log(storedUserId)
            const data = {
                productId: products.id,
                quantity: quantity,
                userId: storedUserId,
                paymentStatus: "pending",
                advanced_amount: 500,
                orderDate: new Date(),
                orderStatus: "pending",
                total_amount: 0,
                type:"inc"
            }
            const response = await axios.post(`${API_URL}/create-order`, data);
            updateCount();
            //if (response) {
            //    console.log("iii");
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Product added to cart!',
                });
            //}
        } catch (error) {
            console.log(error);
            // Handle login failure
        }
    }

    return (
        <ScrollView style={styles.container}>
            {/* Product Card with Image and Details */}
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: `data:image/png;base64,${products.image}` }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={styles.productTitle}>{toCamelCase(products.productname)}</Text>
                    <Text style={styles.productPrice}>₹{products.price}</Text>
                    <Text style={styles.manufactureDate}>Manufactured: {products.manufacture}</Text>
                    <Text style={styles.sectionTitle}>Type of Wood:</Text>
                    <Text style={styles.detailText}>{products.woodtypename}</Text>
                    <Text style={styles.sectionTitle}>Dimensions:</Text>
                    <Text style={styles.detailText}>{products.length} cm x {products.width} cm</Text>
                    <Text style={styles.sectionTitle}>Specifications:</Text>
                    <Text style={styles.detailText}>{products.description}</Text>

                    {/* Quantity Selector */}
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                            <Text style={styles.quantityText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>{quantity}</Text>
                        <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                            <Text style={styles.quantityText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Add to Cart Button */}
                    <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={addToCart} style={styles.addToCartButton}>
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = {
    container: { padding:0, backgroundColor: '#F8F9FA' },
    imageContainer: { alignItems: 'center', marginBottom: 16 },
    productImage: { width: '100%', height: 200, borderRadius: 12 },
    card: { marginBottom: 16, padding: 16 },
    productTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    productPrice: { fontSize: 18, color: '#E91E63', marginBottom: 8 },
    manufactureDate: { fontSize: 14, color: '#777' },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 8 },
    detailText: { fontSize: 14, color: '#444' },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
    quantityButton: { padding: 10, backgroundColor: '#ddd', borderRadius: 8, marginHorizontal: 8 },
    quantityText: { fontSize: 18, fontWeight: 'bold' },
    quantityValue: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 8 },
    buttonContainer: { marginTop: 20, alignItems: 'center' },

    ratingContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    ratingText: {
        fontSize: 16,
        color: '#333',
        marginTop: 5,
    },
    reviewsContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    reviewItem: {
        marginBottom: 15,
    },
    reviewUsername: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    reviewText: {
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
    },
    reviewDate: {
        fontSize: 12,
        color: '#888',
    },
};

export default ProductDetails;
