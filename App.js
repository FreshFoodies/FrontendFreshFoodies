import React, { useState } from "react";
import { StyleSheet} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InventoryScreen from './pages/InventoryScreen';
import HouseBasketScreen from './pages/HouseBasketScreen';
import ScanReceiptScreen from "./pages/ScanReceiptScreen";
import Manual from "./pages/Manual.js";
import TakeReceiptPhotoScreen from "./pages/receipt/TakeReceiptPhotoScreen";
import EditReceiptPhotoScreen from "./pages/receipt/EditReceiptPhotoScreen";
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Home(props) {
  console.log(props.route.params.data);
  let data = props.route.params.data;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F8F8F8',
          borderTopWidth: 2
        },
        tabBarActiveTintColor: '#2FC6B7',
        tabBarInactiveTintColor: 'black', 
      }}
    >
      <Tab.Screen 
        name="Inventory" 
        component={InventoryScreen}
        options={{
          tabBarLabel: '',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="fridge-outline" color={color} size={35} />
          ),
        }}
        initialParams={{data}}
      />
      <Tab.Screen
        name="Scanner"
        component={ScanReceiptScreen}
        options={{
          tabBarLabel: '',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="scan1" color={color} size={35} />
          ),
        }}  
      />
      <Tab.Screen
        name="HouseBasket"
        component={HouseBasketScreen}
        options={{
          tabBarLabel: '',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="shopping-basket" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [data, setData] = useState([
    {
      name: "banana",
      category: "produce",
      quantity: 1,
      expiration_date: "2023-03-10",
      location: "counter"
    },
    {
      name: "steak",
      category: "meat",
      quantity: 2,
      expiration_date: "2023-02-25",
      location: "freezer"
    },
    {
      name: "egg",
      category: "dairy",
      quantity: 6,
      expiration_date: "2023-03-28",
      location: "fridge"
    },
    {
      name: "apple",
      category: "produce",
      quantity: 3,
      expiration_date: "2023-03-07",
      location: "fridge"
    },
  
  ]);

  return (
    <NavigationContainer style={styles.image}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
          initialParams={{data:data}}
        />
        <Stack.Screen 
          name="Manual"
          component={Manual} 
          options={{headerShown: false}}
          setOptions={{setData:setData}}
          initialParams={{data:data}}
        />
        <Stack.Screen
          name="TakeReceiptPhotoScreen"
          component={TakeReceiptPhotoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditReceiptPhotoScreen"
          component={EditReceiptPhotoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ScanReceiptScreen"
          component={ScanReceiptScreen}
          options={{headerShown: false}}
          initialParams={{setData:setData}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }
});
