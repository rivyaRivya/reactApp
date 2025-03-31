import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-ratings'; // Importing the Rating component for star ratings
import axios from "axios";
import { Card, Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from "../constant";
import { AuthContext } from '../auth/authContext';
import { TextInput } from 'react-native-gesture-handler';

const ProductDetails = ({ route }) => {
    const { product } = route.params;
    const [loading, setLoading] = useState(true);
    const url = CONSTANTS.BASE_URL;
    const API_URL = `${url}`;
    const [products, setProduct] = useState(Object);
    const [quantity, setQuantity] = useState(1);
    const [review, setReview] = useState([]);
    const { updateCount, userType } = useContext(AuthContext);
    const [averageRating, setAverageRating] = useState(0);

    const [showReview, setShowReview] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [variant, setVariant] = useState([]);

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    useEffect(() => {
        fetchProducts();
        reviewDetails();
    }, []);


    const getVariant = async (mainArray) => {
        const mainArrayData = mainArray?JSON.parse(mainArray):[];
        const response = await axios.get(`${API_URL}/get-variant`); // Sample API
        const updatedArray = mainArrayData.map(item => {
            // Find the corresponding reference object with the same `id`
            const matchingReference = response.data.find(ref => ref.type === item.type);
            return {
                ...item,
                values: item.values.map(value => {
                    if (matchingReference) {
                        // Find the value inside the matched reference's values array
                        const matchingValue = matchingReference.values.find(refValue => refValue.id === Number(value.id));
                        return { ...value, name: matchingValue ? matchingValue.name : "Not Found" };
                    }
                    return { ...value, name: "Not Found" };
                })
            };
        });
        setVariant(updatedArray);
    }
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
            getVariant(response.data.variant);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    const reviewDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/product-review?id=${product.id}`); // Sample API
            setReview(response.data);
            if (response.data.length === 0) return "0.00"; // Avoid division by zero

            const totalRatings = response.data.reduce((sum, review) => sum + Number(review.rating), 0);
            let average = totalRatings / response.data.length;
            setAverageRating(average.toFixed(2)); 

        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
        
    }
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

    const handleSubmit =async () => {
        console.log("clicked", reviewText, rating);
        if (rating) {
            const storedUserId = await AsyncStorage.getItem('userId');
            const data = {
                user_id: storedUserId,
                product_id: products.id,
                review: reviewText,
                rating: rating
            }
            console.log(data);
            const response = await axios.post(`${API_URL}/review`, data);
            console.log(response);
            if (response) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Review Added',
                });
                reviewDetails();
                setShowReview(false);
                setReviewText("");
                setRating(0);
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Validation error',
                text2: 'Add rating',
            });
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

                    {variant.map((variant, index) => (
                        <View key={index}>
                            <Text style={styles.sectionTitle}>{variant.type}:</Text>
                            <Text style={styles.detailText}>
                                {variant.values.map(val => val.name).join(", ") }
                            </Text>
                        </View>
                    ))}

                    <Text style={styles.sectionTitle}>Specifications:</Text>
                    <Text style={styles.detailText}>{products.description}</Text>
                    {userType == "user" ?
                    <View>
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
                            </View> </View>: <></>}



                    <View style={styles.container}>
                        {userType == "user" && <TouchableOpacity style={styles.addReviewButton} onPress={() => setShowReview(true)}>
                            <Text style={styles.addReviewText}>Add Review</Text>
                        </TouchableOpacity>}

                        {showReview && (
                            <View style={styles.reviewBox}>
                                <Text style={styles.reviewTitle}>Leave a Review</Text>
                                <Rating
                                    type="star"
                                    ratingCount={5}
                                    imageSize={20}
                                    startingValue="0"
                                    onFinishRating={(value) => setRating(value)}
                                />
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="Write your review here..."
                                    value={reviewText}
                                    onChangeText={setReviewText}
                                    multiline
                                />
                                <TouchableOpacity style={styles.confirmButton} onPress={() => {  handleSubmit(); }}>
                                    <Text style={styles.confirmButtonText}>Submit Review</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.ratingContainer}>
                        <Text style={styles.sectionTitle}>Customer Rating</Text>
                        <Rating
                            type="star"
                            ratingCount={5}
                            imageSize={20}
                            readonly
                            startingValue={averageRating}
                        />
                        <Text style={styles.ratingText}>Average Rating: {averageRating } / 5</Text>
                    </View>

                     Reviews Section 
                    <View style={styles.reviewsContainer}>
                        <Text style={styles.sectionTitle}>Customer Reviews</Text>
                        <FlatList
                            data={review}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.reviewItem}>
                                    <Text style={styles.reviewUsername}>{item.username}</Text>
                                    <Text style={styles.reviewText}>"{item.review}"</Text>
                                    <Rating
                                        type="star"
                                        ratingCount={5}
                                        imageSize={10}
                                        readonly
                                        startingValue={item.rating}
                                    />
                                </View>
                            )}
                        />
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = {
    container: { padding: 0, backgroundColor: '#F8F9FA' },
    imageContainer: { alignItems: 'center', marginBottom: 16 },
    productImage: { width: '100%', height: 200, borderRadius: 12 },
    card: { marginBottom: 16, padding: 0 },
    productTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    productPrice: { fontSize: 18, color: '#E91E63', marginBottom: 8 },
    manufactureDate: { fontSize: 14, color: '#777' },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 8 ,marginBottom:10},
    detailText: { fontSize: 14, color: '#444' },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
    quantityButton: { padding: 10, backgroundColor: '#ddd', borderRadius: 8, marginHorizontal: 8 },
    quantityText: { fontSize: 18, fontWeight: 'bold' },
    quantityValue: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 8 },
    buttonContainer: { marginTop: 20, alignItems: 'center' },
    confirmButton: {
        backgroundColor: "#28a745",
        borderRadius: 10,
        alignItems: "center",
        width:"50%",
        marginTop: 10,
        padding: 10
    },
    confirmButtonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
    textArea: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginTop: 10,
        padding: 10,
        textAlignVertical: 'top',
    },
    addReviewText:{
        textAlign: "center",
        color: "green",
        fontWeight: "bold",
        padding: 10
    },
    addToCartText: {
        padding: "7",
        marginBottom: "20",
        backgroundColor: "#6750a4",
        borderRadius: 5,
        color: "white",
        fontWeight: "bold"
    },
    ratingContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
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
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
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
    star: {
        cursor: "pointer",
        fontSize: 24,
        color: "gray",
        transition: "color 0.2s ease -in -out"
    },
    width100: {
        width:"100%"
    },
active: {
    color: "yellow"
}
};

export default ProductDetails;
