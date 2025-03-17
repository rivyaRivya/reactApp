import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native';

// Dummy order data (you can replace this with real API data)
const orders = [
    {
        id: '001',
        customerName: 'John Doe',
        address: '123 Main St, Springfield, IL',
        status: 'Pending',
        deliveryTime: '10:00 AM',
    },
    {
        id: '002',
        customerName: 'Jane Smith',
        address: '456 Oak St, Madison, WI',
        status: 'Delivered',
        deliveryTime: '12:00 PM',
    },
    {
        id: '003',
        customerName: 'Tom Brown',
        address: '789 Pine St, Chicago, IL',
        status: 'Pending',
        deliveryTime: '2:00 PM',
    },
];

const OrdersPage = ({ navigation }) => {
    // Handle order click
    const handleOrderClick = (order) => {
        // Here, you would navigate to a detailed page with the order information
        // Assuming you have a 'OrderDetailsPage' that accepts an order object as params
        navigation.navigate('OrderDetails', { order });
    };

    // Render each order item
    const renderOrderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.orderItem}
            onPress={() => handleOrderClick(item)}>
            <Text style={styles.orderId}>Order ID: {item.id}</Text>
            <Text style={styles.customerName}>Customer: {item.customerName}</Text>
            <Text style={styles.orderStatus}>Status: {item.status}</Text>
            <Text style={styles.deliveryTime}>Delivery Time: {item.deliveryTime}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Orders Assigned to You</Text>

            {/* List of Orders */}
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
            />
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
        textAlign: 'center',
    },
    orderItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        elevation: 3,
        marginBottom: 15,
    },
    orderId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    customerName: {
        fontSize: 16,
        color: '#555',
    },
    orderStatus: {
        fontSize: 14,
        color: '#888',
    },
    deliveryTime: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});

export default OrdersPage;
