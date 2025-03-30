import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import CONSTANTS from "../constant";
import { useFocusEffect } from '@react-navigation/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import Toast from "react-native-toast-message";
const quotations = [
    {
        id: "1",
        customerName: "John Doe",
        phone: "1234567890",
        woodType: "Teakwood",
        woodPrice: 500,
        dimensions: "200x100x50",
        quantity: "2",
        budget: "1500",
        additionalNotes: "Urgent delivery required",
        image: "https://via.placeholder.com/100",
        status: "Requested"
    },
    {
        id: "2",
        customerName: "Jane Smith",
        phone: "9876543210",
        woodType: "Rosewood",
        woodPrice: 700,
        dimensions: "150x80x40",
        quantity: "1",
        budget: "1000",
        additionalNotes: "Custom design required",
        image: "https://via.placeholder.com/100",
        status: "Accepted"
    }
];

const QuotationList = ({ navigation }) => {


    const [tableData, setProductData] = useState([]);
    const url = CONSTANTS.BASE_URL;
    const API_URL = `${url}`;
    const [quotations, setQuotation] = useState([]);

    const fetchList = async () => {
        try {

            let storedUserId = await AsyncStorage.getItem('userId');
            const response = await axios.get(`${API_URL}/list-quotation`);
            if (response) {
                console.log(response);
                const selectedObject = response?.data.filter(item => item.user_id == storedUserId);
                setQuotation(selectedObject);
            }
        } catch (error) {
            console.error("Error fetching products", error);
        } 
    }

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                console.log("Page refreshed");
                const storedUserType = await AsyncStorage.getItem("userType");

                fetchList();
                // You can also fetch latest order details or reset the form here
            }
            fetchData();
        }, [])
    );

    const [companyDetails] = useState({
        name: "Wood Connect Pvt Ltd",
        address: "Business Street, Vadakara, Calicut"
    });

    const generatePdf = async (tableData) => {
        tableData = Array(tableData);
            const tableRows = tableData.map(row => `
            <tr>
                <td>${row.productName}</td>
                <td>${row.woodName}</td>
                <td>${row.woodPrice}</td>
                <td>${row.manufacturingCost}</td>
                <td>${row.dimensions}</td>
                <td>${row.quantity}</td>
                <td>${row.discount}</td>
                <td>${row.totalPrice}</td>
            </tr>
        `).join(""); // Joins all rows as a single string

            const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; }
                    .header { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    th, td { border: 1px solid black; padding: 8px; text-align: center; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="header">${companyDetails.name}</div>
                <div>${companyDetails.address}</div>
                <table>
                    <tr>
                        <th>Product Name</th>
                        <th>Wood Name</th>
                        <th>Wood Price</th>
                        <th>Manufacturing cost</th>
                        <th>Dimension</th>
                        <th>Quantity</th>
                        <th>Discount</th>
                        <th>Price</th>
                    </tr>
                    ${tableRows} <!-- Insert dynamically generated table rows -->
                </table>
            </body>
            </html>
        `;

            try {
                const { uri } = await Print.printToFileAsync({ html: htmlContent });

                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(uri);
                } else {
                    console.log('Sharing is not available on this device');
                }
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
    };

    const updateStatus = async(item,status) => {
        try {
            const id = item.id;
            item.status = status;
            const response = await axios.put(`${API_URL}/update-quotation/${id}`, item);
            let message = "Request cancelled";
            if (status == "Booked")
                message = "Booked Successfully! Our partner will get in touch with you soon.Thank you..!";
            if (response) {
                console.log(response);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: message
                });
                fetchList();
            }
        } catch (error) {
            console.error("Error fetching products", error);
        } 
    }
    useEffect(() => {
        fetchList();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={quotations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.details}>
                            <Text style={styles.name}>{item.customerName}</Text>
                            <Text>Phone: {item.mobile}</Text>
                            <Text>Wood: {item.woodName} (₹{item.woodPrice})</Text>
                            <Text>Quantity: {item.quantity}</Text>
                            <Text>Status: {item.status}</Text>
                            <Text>Notes: {item.description}</Text>

                            {item.status === "Requested" && (
                                <TouchableOpacity style={styles.button} onPress={() => updateStatus(item,"Cancelled")}>
                                    <Text style={styles.buttonText}>Cancel Request</Text>
                                </TouchableOpacity>
                            )}
                            {item.status === "Accepted" && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.button} onPress={() => generatePdf(item)}>
                                        <Text style={styles.buttonText}>View Response</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.button} onPress={() => updateStatus(item,"Booked")}>
                                        <Text style={styles.buttonText}>Book now</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {item.status === "Booked" && (
                                    <TouchableOpacity style={styles.button} onPress={() => generatePdf(item)}>
                                        <Text style={styles.buttonText}>View Response</Text>
                                    </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={styles.viewButton}
                                onPress={() => navigation.navigate("Quotation", { quotation: item })}
                            >
                                <Text style={styles.buttonText}>View Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f4f4f4",
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    details: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "rgb(178 27 27)",
        padding: 8,
        borderRadius: 5,
        marginTop: 5,
        alignItems: "center",
    },
    viewButton: {
        backgroundColor: "rgb(103, 80, 164)",
        padding: 8,
        borderRadius: 5,
        marginTop: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default QuotationList;

