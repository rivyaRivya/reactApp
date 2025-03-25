import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import axios from "axios";
import CONSTANTS from '../constant';
import { AuthContext } from '../auth/authContext';
import OrdersPage from '../driver/orders';

const HomePage = ({ navigation }) => {


    const { isLoggedIn, userType, logout } = useContext(AuthContext);
    const url = CONSTANTS.BASE_URL;
    const API_URL = `${url}`;
    const [loading, setLoading] = useState(true);
    const [woodList, setWoodList] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
   
    const fetchWood = async () => {
        try {
            const response = await axios.get(`${API_URL}/wood-type`); // Sample API
            setWoodList(response.data);
        } catch (error) {
            console.error("Error fetching wood", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchProduct = async() => {
        try {
            const response = await axios.get(`${API_URL}/get-product`); // Sample API
            
            if (response) {
                const selectedObject = response?.data.filter(item => item.featured);
                setFeaturedProducts(selectedObject);
            }
        } catch (error) {
            console.error("Error fetching wood", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchWood();
        fetchProduct();
    }, []);

    // Render Item for Wood List
    const renderWoodItem = ({ item }) => (
        <TouchableOpacity style={styles.woodCard} onPress={() => navigation.navigate('Product', { id: item.id })}>
            <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.woodImage} />
            <Text style={styles.woodName}>{item.woodname}</Text>
        </TouchableOpacity>
    );

    // Render Item for Featured Products
    const renderProductItem = ({ item }) => (
        <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
            <Image source={{ uri: `data:image/png;base64,${item.display}` }} style={styles.productImage} />
            <Text style={styles.productName}>{item.productname}</Text>
            <Text style={styles.productPrice}>₹{item.price}</Text>
            {/*<Button mode="contained" onPress={() => navigation.navigate('ProductDetails', { product: item })}>*/}
            {/*    View Details*/}
            {/*</Button>*/}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {userType ==="driver" ? (
                <OrdersPage navigation={navigation} />
            ) : (
            
            <><View style={styles.section}>
                        <Text style={styles.sectionTitle}>Shop by Wood</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <FlatList
                                data={woodList}
                                renderItem={renderWoodItem}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false} />
                        </ScrollView>
                    </View><View style={styles.section}>
                            <Text style={styles.sectionTitle}>Featured Products</Text>
                            <FlatList
                                data={featuredProducts}
                                renderItem={renderProductItem}
                                keyExtractor={(item) => item.id}
                                numColumns={2} // Display 2 products per row
                                columnWrapperStyle={styles.columnWrapper} // Space out the items evenly in a row
                                showsVerticalScrollIndicator={false} />
                        </View></>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
        marginTop:10
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    // Wood List Section Styles
    woodCard: {
        marginRight: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        alignItems: 'center',
    },
    woodImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    woodName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    // Featured Products Section Styles
    productCard: {
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        elevation: 5,
        flex: 1, // Allow card to grow in the row
        margin: 5, // Add space between items
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    productPrice: {
        fontSize: 16,
        color: '#555',
    },
    columnWrapper: {
        justifyContent: 'space-between', // Space out the items evenly in a row
    },
});

export default HomePage;
