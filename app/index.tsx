import { Text, View } from "react-native";
// Create Drawer and Tab Navigators
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from "./auth/login";
import RegisterScreen from "./auth/register";
import HomePage from "./home/home";
const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();
function MyDrawer() {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomePage} options={{
                title: 'Wood Connect',  // Set the header title
            }} />
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
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={MyDrawer} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}
