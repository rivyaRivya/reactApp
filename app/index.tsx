import { Text, View } from "react-native";
// Create Drawer and Tab Navigators
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from "./auth/login";
import RegisterScreen from "./auth/register";
import HomePage from "./home/home";
import ProductList from "./product/productlist";
import ProductDetails from "./product/productDetails";
import CartPage from "./cart/cart";
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import ProfilePage from "./auth/profile";
import OrdersPage from "./driver/orders";
import OrderDetailsPage from "./cart/orderDetails";
const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();
function MyDrawer() {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomePage} options={{
                title: 'Wood Connect',  // Set the header title
            }} />
            <Drawer.Screen name="Profile" component={ProfilePage} />
            <Drawer.Screen name="Orders" component={OrdersPage} />
        </Drawer.Navigator>
    );
}
export default function Index() {
  return (
      <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
              headerStyle: {
                  backgroundColor: '#3E2723',  // Background color of the header
              },
              headerTitleStyle: {
                  color: '#fff',  // Title text color
                  fontSize: 24,  // Title font size
                  fontWeight: 'bold',  // Title font weight
              },
              headerTintColor: '#fff',  // Color of icons or buttons in the header
              headerShown: true,
          }}
      >
          <Stack.Screen name="Product" component={ProductList} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} ></Stack.Screen>
          {/* Cart Page Screen */}
          <Stack.Screen
              name="Cart"
              component={CartPage}
             
          />
          <Stack.Screen
              name="OrderDetails"
              component={OrderDetailsPage}

          />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen
              name="Home"
              component={MyDrawer}
              options={({ navigation }) => ({
                  title: 'Home',
                  headerRight: () => (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                          <Ionicons
                              name="cart-outline"
                              size={30}
                              color="black"
                              onPress={() => navigation.navigate('Cart')} // Navigate to the Cart Page
                          />
                         
                      </View>
                  ),
              })} />
      </Stack.Navigator>
  );
}
