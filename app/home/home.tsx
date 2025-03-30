import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const fetchWood = async () => {
        try {
            const response = await axios.get(`${API_URL}/wood-type`);
            setWoodList(response.data);
        } catch (error) {
            console.error("Error fetching wood", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-product`);
            if (response) {
                const selectedObject = response?.data.filter(item => item.featured);
                setFeaturedProducts(selectedObject);
            }
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = async (query) => {
        if (query.length > 0) {
            try {
                const response = await axios.get(`${API_URL}/productSearch?keyword=${query}`);
                setSearchResults(response.data);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error searching products", error);
            }
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        fetchWood();
        fetchProduct();
    }, []);

    return (
        <FlatList
            ListHeaderComponent={
                <>
                    {userType === "driver" ? (
                        <OrdersPage navigation={navigation} />
                    ) : (
                        <>
                            {/* Search Input */}
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChangeText={(text) => {
                                    setSearchQuery(text);
                                    searchProducts(text);
                                }}
                            />
                            {/* Search Results Dropdown */}
                            {showDropdown && (
                                    <View style={styles.dropdown}>
                                       
                                    {searchResults.length > 0 ? (
                                        searchResults.map((item) => (
                                            <TouchableOpacity key={item.id} style={styles.dropdownItem} onPress={() => {
                                                setSearchQuery(item.productname);
                                                setShowDropdown(false);
                                                navigation.navigate('ProductDetails', { product: item });
                                            }}>
                                                <Text>{item.productname}</Text>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <Text style={styles.noResults}>No results found</Text>
                                    )}
                                </View>
                            )}

                            {/* Shop by Wood (Horizontal Scroll) */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Shop by Wood</Text>
                                <FlatList
                                    data={woodList}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.woodCard} onPress={() => navigation.navigate('Product', { id: item.id })}>
                                            <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.woodImage} />
                                            <Text style={styles.woodName}>{item.woodname}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: 10 }}
                                />
                                </View>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Featured Products</Text>
                                </View>

                        </>
                    )}
                </>
            }
            data={userType === "driver" ? [] : featuredProducts}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
                    <Image source={{ uri: `data:image/png;base64,${item.display}` }} style={styles.productImage} />
                    <Text style={styles.productName}>{item.productname}</Text>
                    <Text style={styles.productPrice}>₹{item.price}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        margin: 10,
        paddingHorizontal: 10,
    },
    dropdown: {
        backgroundColor: '#fff',
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        borderRadius: 8,
        elevation: 5,
        zIndex: 1,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    section: {
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 10,
    },
    woodCard: {
        marginRight: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        elevation: 0,
        alignItems: 'center',
    },
    woodImage: {
        width: 100,
        height: 100,
        borderRadius: 3,
    },
    woodName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    productCard: {
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 5,
        elevation: 5,
        flex: 1,
        margin: 5,
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    productName: {
        fontSize: 15,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    productPrice: {
        fontSize: 14,
        color: '#555',
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    noResults: {
        padding: 10,
        textAlign: 'center',
        color: '#999',
    }
});

export default HomePage;
