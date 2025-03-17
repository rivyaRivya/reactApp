import React from 'react';
import { View, Text, Image, Button, FlatList, ScrollView, StyleSheet } from 'react-native';

const HomePage = ({ navigation }) => {
    // Sample wood list data
    const woodList = [
        { id: '1', name: 'Oak', image: require('../../assets/custom.jpg') },
        { id: '2', name: 'Pine', image: require('../../assets/decor.jpg') },
        { id: '3', name: 'Mahogany', image: require('../../assets/furniture.jpg') },
        { id: '4', name: 'Walnut', image: require('../../assets/custom.jpg') },
    ];

    // Sample featured products data
    const featuredProducts = [
        { id: '1', name: 'Wooden Chair', price: '$150', image: require('../../assets/custom.jpg') },
        { id: '2', name: 'Wooden Table', price: '$250', image: require('../../assets/decor.jpg') },
        { id: '3', name: 'Wooden Shelf', price: '$180', image: require('../../assets/furniture.jpg') },
        { id: '4', name: 'Wooden Bench', price: '$220', image: require('../../assets/custom.jpg') },
    ];

    // Render Item for Wood List
    const renderWoodItem = ({ item }) => (
        <View style={styles.woodCard} onPress={() => navigation.navigate('Product')}>
            <Image source={item.image} style={styles.woodImage} />
            <Text style={styles.woodName}>{item.name}</Text>
        </View>
    );

    // Render Item for Featured Products
    const renderProductItem = ({ item }) => (
        <View style={styles.productCard} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            {/*<Button mode="contained" onPress={() => navigation.navigate('ProductDetails', { product: item })}>*/}
            {/*    View Details*/}
            {/*</Button>*/}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Wood List Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shop by Wood</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <FlatList
                        data={woodList}
                        renderItem={renderWoodItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </ScrollView>
            </View>

            {/* Featured Products Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Products</Text>
                <FlatList
                    data={featuredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2} // Display 2 products per row
                    columnWrapperStyle={styles.columnWrapper} // Space out the items evenly in a row
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
