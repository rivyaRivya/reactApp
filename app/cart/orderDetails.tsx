import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image
} from 'react-native';
import axios from "axios";
import CONSTANTS from '../constant';

const OrderDetailsPage = ({ route }) => {

    const [order, setOrders] = useState({
        advanced_amount: null,
        assign_date: null,
        delivery_date: null,
        driverId: null,
        driverName: null,
        id: null,
        orderDate: null,
        paymentStatus: null,
        status: null,
        total_amount: null,
        userId: null,
        username: null,
        products: []
});

    const url = CONSTANTS.BASE_URL;
    const API_URL = `${url}`;

    console.log(route.params)
    const data = route.params.order;
    const listOrderDetails = async () => {
        try {
            // Make an API call to the Spring Boot backend login endpoint
            const response = await axios.get(`${API_URL}/get-orderDetails?id=${data.id}`);

            if (response) {
                console.log(response)
                const datas = {
                    advanced_amount: response.data.order.advanced_amount,
                    assign_date: response.data.order.assign_date,
                    delivery_date: response.data.order.delivery_date,
                    driverId: response.data.order.driverId,
                    driverName: response.data.order.driverName,
                    id: response.data.order.id,
                    orderDate: response.data.order.orderDate,
                    paymentStatus: response.data.order.paymentStatus,
                    status: response.data.order.status,
                    total_amount: response.data.order.total_amount,
                    userId: response.data.order.userId,
                    username: response.data.order.username,
                    products: response.data.product
                }
                setOrders(datas);
            }
        } catch (error) {
            console.log("rrrrrrrrrrrrrrr")
            // Handle login failure
        }
    };

    useEffect(() => {
        listOrderDetails();
    }, []);

    // Render each product item
    const renderProductItem = ({ item }) => (
        <View style={styles.productItem}>
            {/* Product Image */}
            <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.productImage} />

            {/* Product Information */}
            <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.productname}</Text>
                <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.productPrice}>Price: ₹{item.price}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Order Details</Text>

            {/* Order Information */}
            <Text style={styles.orderId}>Order ID: {order.id}</Text>
            <Text style={styles.customerName}>Customer: {order.username}</Text>
            {/*<Text style={styles.address}>Address: {order.}</Text>*/}
            <Text style={styles.orderStatus}>Status: {order.status}</Text>
            <Text style={styles.orderStatus}>Advance Amount: ₹{order.advanced_amount}</Text>
            <Text style={styles.orderStatus}>Total Amount: ₹{order.total_amount}</Text>
            <Text style={styles.deliveryTime}>Delivery Time: {order.delivery_date}</Text>

            {/* Product List */}
            <Text style={styles.productListTitle}>Products in this Order:</Text>

            <FlatList
                data={order.products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.productId}
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
    orderId: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    customerName: {
        fontSize: 16,
        color: '#555',
    },
    address: {
        fontSize: 16,
        color: '#555',
    },
    orderStatus: {
        fontSize: 16,
        color: '#888',
    },
    deliveryTime: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    productListTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    productItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        elevation: 3,
        marginBottom: 15,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 15,
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    productQuantity: {
        fontSize: 16,
        color: '#555',
    },
    productPrice: {
        fontSize: 16,
        color: '#888',
    },
});

export default OrderDetailsPage;
