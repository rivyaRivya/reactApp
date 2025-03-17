import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import { Card } from 'react-native-paper';  // Using React Native Paper for a clean UI
import { Rating } from 'react-native-ratings'; // Importing the Rating component for star ratings

const ProductDetails = ({ route }) => {
    const { product } = route.params;  // Extract product data passed from the list page

    return (
        <ScrollView style={styles.container}>
            {/* Product Image */}
            <Image source={{ uri: product.image }} style={styles.productImage} />

            {/* Product Information Card */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.productTitle}>{product.name}</Text>
                    <Text style={styles.productPrice}>${product.price}</Text>
                </Card.Content>
            </Card>

            {/* Type of Wood and Dimensions */}
            <View style={styles.detailsContainer}>
                <Text style={styles.sectionTitle}>Type of Wood:</Text>
                <Text style={styles.detailText}>{product.woodType}</Text>

                <Text style={styles.sectionTitle}>Dimensions:</Text>
                <Text style={styles.detailText}>Length: {product.length} cm</Text>
                <Text style={styles.detailText}>Width: {product.width} cm</Text>

                <Text style={styles.sectionTitle}>Specifications:</Text>
                <Text style={styles.detailText}>{product.specifications}</Text>
            </View>

             Rating Section 
            <View style={styles.ratingContainer}>
                <Text style={styles.sectionTitle}>Customer Rating</Text>
                <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={30}
                    readonly
                    startingValue={product.rating.rate}
                />
                <Text style={styles.ratingText}>Average Rating: {product.rating.rate} / 5</Text>
            </View>

            {/* Reviews Section */}
            {/*<View style={styles.reviewsContainer}>*/}
            {/*    <Text style={styles.sectionTitle}>Reviews</Text>*/}
            {/*    <FlatList*/}
            {/*        data={product.reviews}*/}
            {/*        keyExtractor={(item, index) => index.toString()}*/}
            {/*        renderItem={({ item }) => (*/}
            {/*            <View style={styles.reviewItem}>*/}
            {/*                <Text style={styles.reviewUsername}>{item.username}</Text>*/}
            {/*                <Text style={styles.reviewText}>"{item.review}"</Text>*/}
            {/*                <Text style={styles.reviewDate}>{item.date}</Text>*/}
            {/*            </View>*/}
            {/*        )}*/}
            {/*    />*/}
            {/*</View>*/}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    productImage: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 15,
        resizeMode: 'contain',
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    productTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    productPrice: {
        fontSize: 22,
        color: '#888',
        marginTop: 5,
    },
    detailsContainer: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    detailText: {
        fontSize: 16,
        color: '#555',
        marginVertical: 5,
    },
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
});

export default ProductDetails;
