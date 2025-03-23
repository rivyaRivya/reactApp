import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native';
import axios from "axios";


import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../constant';


const OrdersPage = ({ navigation }) => {

    const [orders, setOrders] = useState([]);

    const url = CONSTANTS.BASE_URL;
    const API_URL = `${url}`;


    // Handle order click
    const handleOrderClick = (order) => {
        // Here, you would navigate to a detailed page with the order information
        // Assuming you have a 'OrderDetailsPage' that accepts an order object as params
        navigation.navigate('OrderDetails', { order });
    };

    const listOrders = async () => {
        try {
            // Make an API call to the Spring Boot backend login endpoint
            const response = await axios.get(`${API_URL}/get-orders`);

            if (response) {
                console.log(response)
                const storedUserId = await AsyncStorage.getItem('userId');
                console.log(storedUserId)
                const filteredOrder = response.data.filter(order => order.userId == storedUserId);
                setOrders(filteredOrder);
            }
        } catch (error) {
            console.log("rrrrrrrrrrrrrrr")
            // Handle login failure
        }
    };

    useEffect(() => {
        listOrders();
    }, []);

    // Render each order item
    const renderOrderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.orderItem}
            onPress={() => handleOrderClick(item)}>
            <Text style={styles.orderId}>Order ID: {item.id}</Text>
            <Text style={styles.customerName}>Customer: {item.username}</Text>
            <Text style={styles.orderStatus}>Status: {item.status}</Text>
            <Text style={styles.orderStatus}>Payment Status: {item.paymentStatus}</Text>
            <Text style={styles.deliveryTime}>Delivery Date: {item.delivery_date}</Text>
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
