// HomePage.js
import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';

const HomePage = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Wood Connect</Text>
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shop by Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Card style={styles.categoryCard}>
                        <Image
                            source={require('../../assets/furniture.jpg')}  // Add an image for categories
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>Furniture</Text>
                    </Card>
                    <Card style={styles.categoryCard}>
                        <Image
                            source={require('../../assets/decor.jpg')}  // Add an image for categories
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>Decor</Text>
                    </Card>
                    <Card style={styles.categoryCard}>
                        <Image
                            source={require('../../assets/custom.jpg')}  // Add an image for categories
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>Custom Work</Text>
                    </Card>
                </ScrollView>
            </View>

            {/* Featured Products Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Products</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Card style={styles.productCard}>
                        <Image
                            source={require('../../assets/decor.jpg')}  // Replace with actual product images
                            style={styles.productImage}
                        />
                        <Text style={styles.productName}>Wooden Chair</Text>
                        <Text style={styles.productPrice}>$150</Text>
                        <Button mode="contained" onPress={() => navigation.navigate('ProductDetail')}>View</Button>
                    </Card>
                    <Card style={styles.productCard}>
                        <Image
                            source={require('../../assets/furniture.jpg')}  // Replace with actual product images
                            style={styles.productImage}
                        />
                        <Text style={styles.productName}>Wooden Table</Text>
                        <Text style={styles.productPrice}>$250</Text>
                        <Button mode="contained" onPress={() => navigation.navigate('ProductDetail')}>View</Button>
                    </Card>
                </ScrollView>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                    <Text style={styles.footerText}>Browse All Products</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    header: {
        padding: 20,
        backgroundColor: '#3E2723',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    categoryCard: {
        marginRight: 10,
        width: 150,
        borderRadius: 10,
    },
    categoryImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
    },
    categoryText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 5,
        fontWeight: 'bold',
    },
    productCard: {
        marginRight: 10,
        width: 180,
        borderRadius: 10,
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    productPrice: {
        fontSize: 14,
        color: '#ff5722',
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        backgroundColor: '#3E2723',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default HomePage;
