import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./pages/login/LoginScreen.js";
import Manual from "./pages/Manual.js";
import HomeScreen from "./pages/HomeScreen";
import TakeReceiptPhotoScreen from "./pages/receipt/TakeReceiptPhotoScreen";
import ConfirmReceiptPhotoScreen from "./pages/receipt/ConfirmReceiptPhotoScreen";
import ProcessReceiptPhotoScreen from "./pages/receipt/ProcessReceiptPhotoScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native";
import OfferUp from "./pages/OfferUp";
import CreateFridge from "./pages/CreateFridge.js";

const Stack = createNativeStackNavigator();

const App = () => {
  const [statusKeyLoaded, setStatusKeyLoaded] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("user_email").then((result) => {
      if (result != null) {
        setInitialRouteName("Home");
        console.log("email not null");
      } else {
        setInitialRouteName("LoginScreen");
        console.log("email null");
      }
      console.log("initialRouteName: " + initialRouteName);
      setStatusKeyLoaded(true);
    });
  });
  return (
    <>
      {!statusKeyLoaded && <Text style={styles.title}>LOADING</Text>}
      {statusKeyLoaded && (
        <NavigationContainer style={styles.image}>
          <Stack.Navigator initialRouteName={initialRouteName}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Manual"
              component={Manual}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TakeReceiptPhotoScreen"
              component={TakeReceiptPhotoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ConfirmReceiptPhotoScreen"
              component={ConfirmReceiptPhotoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProcessReceiptPhotoScreen"
              component={ProcessReceiptPhotoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OfferUp"
              component={OfferUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateFridge"
              component={CreateFridge}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 35,
    paddingBottom: "1%",
  },
});

export default App;
