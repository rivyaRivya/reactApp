import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native';
import axios from "axios";
import CONSTANTS from '../constant';
import { AuthContext } from '../auth/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderDetailsPage = ({ route, navigation }) => {

    const { userType } = useContext(AuthContext);
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
    const data = route.params.order;

    const listOrderDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-orderDetails?id=${data.id}`);
            if (response) {
                const datas = {
                    ...response.data.order,
                    products: response.data.product
                };
                setOrders(datas);
            }
        } catch (error) {
            console.log("Error fetching order details", error);
        }
    };

    useEffect(() => {
        listOrderDetails();
    }, []);

    const updateOrderStatus = async (status) => {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log(storedUserId)
        if (status == "Accepted") {
            const formData = new FormData();

            formData.append('driver_id', storedUserId);
            console.log(formData)
            try {
                const response = await axios.put(`${API_URL}/update-orderTable/${order.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            } catch (e) { console.log("ooo",e) }
            listOrderDetails();
        } else {
            try {
                const formData = new FormData();

                formData.append('status', status);
                await axios.put(`${API_URL}/update-status/${order.id}`, formData);
                setOrders((prevOrder) => ({ ...prevOrder, status }));
                listOrderDetails();
            } catch (error) {
                console.log("Error updating order status", error);
            }
        }
    };

    const renderButtons = () => {
        if (userType !== "driver" && order.status === 'Confirmed') {
            return (
                <TouchableOpacity style={styles.button} onPress={() => updateOrderStatus('Cancelled')}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            );
        };
        if (order.status === 'Confirmed') {
            return (
                <TouchableOpacity style={styles.button} onPress={() => updateOrderStatus('Accepted')}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
            );
        } else if (order.status === 'Ready for departure') {
            return (
                <View style={styles.buttonGroup}>
                    {/*<TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => updateOrderStatus('Rejected')}>*/}
                    {/*    <Text style={styles.buttonText}>Reject</Text>*/}
                    {/*</TouchableOpacity>*/}
                    <TouchableOpacity style={[styles.button, styles.outForDeliveryButton]} onPress={() => updateOrderStatus('Out for delivery')}>
                        <Text style={styles.buttonText}>Out for Delivery</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (order.status === 'Out for delivery') {
            return (
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={[styles.button, styles.deliveredButton]} onPress={() => updateOrderStatus('Delivered')}>
                        <Text style={styles.buttonText}>Delivered</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    const renderProductItem = ({ item }) => (
        <View style={styles.productItem}>
            <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.productname}</Text>
                <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.productPrice}>Price: ₹{item.price}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>{renderButtons()}</View>
            <Text style={styles.pageTitle}>Order Details</Text>
            <Text style={styles.orderId}>Order ID: {order.id}</Text>
            <Text style={styles.customerName}>Customer: {order.username}</Text>
            <Text style={styles.orderStatus}>Status: {order.status}</Text>
            <Text style={styles.orderStatus}>Advance Amount: ₹{order.advanced_amount}</Text>
            <Text style={styles.orderStatus}>Total Amount: ₹{order.total_amount}</Text>
            <Text style={styles.deliveryTime}>Delivery Time: {order.delivery_date}</Text>

            <Text style={styles.productListTitle}>Products in this Order:</Text>
            <FlatList
                data={order.products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.productId?.toString() || Math.random().toString()}
            />

            {order.status == 'pending' && (
                <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate('OrderSummary')}>
                    <Text style={styles.buttonText}>Confirm Order</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    buttonContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 10,
    },
    confirmButton: {
        backgroundColor: '#008CBA',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    rejectButton: {
        backgroundColor: '#D32F2F',
    },
    outForDeliveryButton: {
        backgroundColor: '#FFA000',
    },
    deliveredButton: {
        backgroundColor: '#1976D2',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
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
    }
});

export default OrderDetailsPage;
