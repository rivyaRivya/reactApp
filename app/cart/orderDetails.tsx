import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image
} from 'react-native';

// Sample order data with products and image URLs
const order = {
    id: '001',
    customerName: 'John Doe',
    address: '123 Main St, Springfield, IL',
    status: 'Pending',
    deliveryTime: '10:00 AM',
    products: [
        {
            productId: 'P001',
            name: 'Wooden Chair',
            quantity: 2,
            price: 50.00,
            imageUrl: 'https://ii1.pepperfry.com/media/catalog/product/m/a/1600x1760/marin-solid-wood-6-seater-dining-set-in-provincial-teak-finish-by-woodsworth-marin-solid-wood-6-seat-mtanqa.jpg' // Example image URL
        },
        {
            productId: 'P002',
            name: 'Wooden Table',
            quantity: 1,
            price: 150.00,
            imageUrl: 'https://ii1.pepperfry.com/media/catalog/product/m/a/1600x1760/marin-solid-wood-6-seater-dining-set-in-provincial-teak-finish-by-woodsworth-marin-solid-wood-6-seat-mtanqa.jpg' // Example image URL
        },
        {
            productId: 'P003',
            name: 'Wooden Shelf',
            quantity: 3,
            price: 30.00,
            imageUrl: 'https://ii1.pepperfry.com/media/catalog/product/m/a/1600x1760/marin-solid-wood-6-seater-dining-set-in-provincial-teak-finish-by-woodsworth-marin-solid-wood-6-seat-mtanqa.jpg' // Example image URL
        },
    ],
};

const OrderDetailsPage = () => {
    // Render each product item
    const renderProductItem = ({ item }) => (
        <View style={styles.productItem}>
            {/* Product Image */}
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />

            {/* Product Information */}
            <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Order Details</Text>

            {/* Order Information */}
            <Text style={styles.orderId}>Order ID: {order.id}</Text>
            <Text style={styles.customerName}>Customer: {order.customerName}</Text>
            <Text style={styles.address}>Address: {order.address}</Text>
            <Text style={styles.orderStatus}>Status: {order.status}</Text>
            <Text style={styles.deliveryTime}>Delivery Time: {order.deliveryTime}</Text>

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
