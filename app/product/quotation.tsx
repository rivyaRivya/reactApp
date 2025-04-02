import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CONSTANTS from "../constant";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Buffer } from "buffer";

const QuotationPage: React.FC = ({ route,navigation }) => {
    const { quotation } = route.params;
    const API_URL = CONSTANTS.BASE_URL;
    const [woodTypes, setWoodTypes] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [color, setColor] = useState("");
    const [quantity, setQuantity] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [woodType, setWoodType] = useState("");
    const [woodPrice, setWoodPrice] = useState("");
    const [productName, setProductName] = useState("");
    const [status, setStatus] = useState("");

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to upload an image.");
        }
    };

    const handleImageUpload = async () => {
        await requestPermissions();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            const selectedImage = result.assets[0];
            setImage(selectedImage.uri);
            setImageFile(selectedImage.file)
        }
    };


    // Convert URI to Blob (Example)
    const convertToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        console.log("Blob created:", blob);
        return blob;
    };


    const update = async () => {
        if (!customerName || !phone || !additionalNotes || !woodType || !productName) {
            alert("Please fill all required fields.");
            return;
        }
        let dimPattern = /^\d+(\.\d+)?\*\d+(\.\d+)?\*\d+(\.\d+)?$/;

        console.log(dimensions, dimPattern.test(dimensions))
        if (!dimPattern.test(dimensions)) {
            //setTotalPrice("Invalid format");
            Toast.show({
                type: 'error',
                text1: 'Invalid dimensions',
                text2: 'Add valid dimension in L*W*T format'
            });
            return;
        }
        let storedUserId = await AsyncStorage.getItem('userId');
        const formData = new FormData();
        formData.append('customerName', customerName);
        formData.append('phone', phone);
        formData.append('woodid', woodType);
        formData.append('dimension', dimensions);
        formData.append('color', color);
        formData.append('quantity', quantity);
        formData.append('additionalNotes', additionalNotes);
        formData.append('userId', storedUserId);
        formData.append('datas', imageFile);
        formData.append('woodType_id', woodType);
        formData.append('productName', productName);
        await axios.post(`${API_URL}/update-quotations/${quotation.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        Toast.show({
            type: 'success',
            text1: 'Quotation Updated',
            text2: 'Quotation Updated Successfully!'
        });
        navigation.navigate('QuotationList');
    }
    const handleSend = async () => {
        if (!customerName || !phone || !additionalNotes || !woodType || !productName || !dimensions) {
            alert("Please fill all required fields.");
            return;
        }
        let dimPattern = /^\d+(\.\d+)?\*\d+(\.\d+)?\*\d+(\.\d+)?$/;

        console.log(dimensions, dimPattern.test(dimensions))
        if (!dimPattern.test(dimensions)) {
            //setTotalPrice("Invalid format");
            Toast.show({
                type: 'error',
                text1: 'Invalid dimensions',
                text2: 'Add valid dimension in L*W*T format'
            });
            return;
        }
        let storedUserId = await AsyncStorage.getItem('userId');
        const formData = new FormData();
        formData.append('customerName', customerName);
        formData.append('phone', phone);
        formData.append('woodid', woodType);
        formData.append('dimension', dimensions);
        formData.append('color', color);
        formData.append('quantity', quantity);
        formData.append('additionalNotes', additionalNotes);
        formData.append('userId', storedUserId);
        formData.append('datas', imageFile);
        formData.append('woodType_id', woodType);
        formData.append('productName', productName);
        await axios.post(`${API_URL}/quotation`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        Toast.show({
            type: 'success',
            text1: 'Quotation Sent',
            text2: 'Your quotation has been sent successfully!'
        });
        navigation.navigate('QuotationList');
    };

    const fetchWood = async () => {
        try {
            const response = await axios.get(`${API_URL}/wood-type`);
            setWoodTypes(response.data);
        } catch (error) {
            console.error("Error fetching wood types", error);
        }
    };

    const fetchDetails = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/quotation-details?id=${id}`);
            console.log(response);
            setAdditionalNotes(response.data.description || "");
            setColor(response.data.color || "");
            setCustomerName(response.data.customerName || "");
            setImage(`data:image/png;base64,${response.data.image}` || null);
            setPhone(response.data.mobile || "");
            setQuantity(response.data.quantity || "");
            setWoodType(response.data.woodTypeId || "");
            setProductName(response.data.productName);
            setDimensions(response.data.dimensions);
            setStatus(response.data.status);
        } catch (error) {
            console.error("Error fetching wood types", error);
        }
    }

    useEffect(() => {
        console.log(quotation)
        if (quotation) {
            fetchDetails(quotation.id)
        }
        fetchWood();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TextInput style={styles.input} placeholder="Customer Name*" value={customerName} onChangeText={setCustomerName} />
                <TextInput style={styles.input} placeholder="Phone Number*" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
                <TextInput style={styles.input} placeholder="Product Name*" value={productName} onChangeText={setProductName} />
                {/*<TextInput style={styles.input} placeholder="Color / Finish" value={color} onChangeText={setColor} />*/}
                <TextInput style={styles.input} placeholder="Dimensions (LxWxT in cm)" value={dimensions} onChangeText={setDimensions} />
                <TextInput style={styles.input} placeholder="Quantity" keyboardType="numeric" value={quantity} onChangeText={setQuantity} />
                <Text style={styles.label}>Select Wood Type *</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={woodType}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            setWoodType(itemValue);
                            setWoodPrice(itemValue ? ` ${woodTypes}` : "");
                        }}
                    >
                        <Picker.Item label="Select Wood Type*" value="" />
                        {Array.isArray(woodTypes) ? (woodTypes.map((type) => (
                            <Picker.Item key={type.id} label={type.woodname} value={String(type.id)} />
                        ))):(<></>)}
                    </Picker>
                </View>
                <TextInput style={styles.textArea} placeholder="Additional Notes*" multiline numberOfLines={4} value={additionalNotes} onChangeText={setAdditionalNotes} />
                <View>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                        <Text style={styles.uploadText}>Upload Image</Text>
                    </TouchableOpacity>
                    {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                    {quotation && status == "Requested" && < TouchableOpacity style={styles.sendButton} onPress={update}>
                    <Text style={styles.sendText}>Update Quotation</Text>
                </TouchableOpacity>}

                    {!quotation && < TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Text style={styles.sendText}>Send Quotation</Text>
                    </TouchableOpacity>}


                </View>
            </View>
        </ScrollView>
    );
};

export default QuotationPage;


const styles = StyleSheet.create({
    textArea: {
        height: 150,
        width: "100%",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
    },
    container: {
        flex: 1,
        padding: 7,
        backgroundColor: "#f4f4f4",
    },
    input: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 10,
        height: 45,
        borderRadius: 8,
        marginBottom: 5,
    },
    pickerContainer: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 10,
    },
    picker: {
        width: "100%",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 5,
    },
    uploadButton: {
        backgroundColor: "rgb(103, 80, 164)",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    uploadText: {
        color: "#fff",
        fontWeight: "bold",
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
        alignSelf: "center",
    },
    sendButton: {
        backgroundColor: "rgb(16 73 109)",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    sendText: {
        color: "#fff",
        fontWeight: "bold",
    },
    scrollContainer: {
        paddingBottom: 50, // Extra bottom space for visibility
        //flex: 1,
        backgroundColor: '#f7f7f7'
    },
});
