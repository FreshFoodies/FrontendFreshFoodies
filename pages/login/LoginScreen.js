import React, { useState } from 'react';  
import { View, Text, StyleSheet, TextInput } from "react-native";
import Button from "../components/Button.js";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeHTTPRequest, createFridge } from '../utils/HttpUtils.js';

const LoginScreen = () => {
  const [userName, setUserName] = useState(null)
  const [userEmail, setUserEmail] = useState(null)
  const navigation = useNavigation();

  const sendLoginRequest = async (email, password) => {
    if (userEmail == null) {
      alert("Please enter an email.")
      return;
    }

    // try to login with the given email
    console.log("making login request");

    var body = {
      email: userEmail.toLowerCase()
    }
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };

    var response = await makeHTTPRequest(requestOptions, "https://looking-glass-api.herokuapp.com/api/login");

    if (response === null) {
      alert("login failed");
      return;
    }

    if (response.email) {
      AsyncStorage.setItem('user_email', response.email);
      navigation.navigate("Home")
    }
  }

  const sendSignupRequest = async () => {
    if (userName == null) {
      alert("Please enter a name.")
      return;
    }
    if (userEmail == null) {
      alert("Please enter an email.")
      return;
    }

    console.log("making signup request");

    var body = {
      name: userName.toLowerCase(),
      email: userEmail.toLowerCase()
    }
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };
    
    var response = makeHTTPRequest(requestOptions, "https://looking-glass-api.herokuapp.com/api/signup");

    if (response === null) {
      alert("signup failed");
      return;
    }
    if (response.email && response._id) {
      AsyncStorage.setItem('user_email', response.email);
      AsyncStorage.setItem('user_id', response._id);

      createFridge(response.email, response.name + "_personal_fridge");
    }
    navigation.navigate("Home")
  }

  const loginDemoAccount = async () => {
    var body = {
      email: "demo@freshfoodies.com"
    }
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };

    var response = await makeHTTPRequest(requestOptions, "https://looking-glass-api.herokuapp.com/api/login");

    if (response && response.email) {
      AsyncStorage.setItem('user_email', response.email);
      navigation.navigate("Home")
    }
  }

  return (
    <View style={styles.page}>
    <Text style={styles.title}>Login or Signup</Text>
    <View style={styles.form}>
      <TextInput
        value={userName}
        onChangeText={(userName) => setUserName(userName)}
        placeholder={'Your Name'}
        style={styles.input}
      />
      <TextInput
        value={userEmail}
        onChangeText={(userEmail) => setUserEmail(userEmail)}
        placeholder={'Your Email'}
        style={styles.input}
      />
      <View style={styles.buttonFlex}>
        <Button
          onPress={sendLoginRequest}
          title="Login"
          color="#2FC6B7"
          width={150}
        />
        <View style={{ width: 20 }} />
        <Button
          onPress={sendSignupRequest}
          title="Signup"
          color="#2FC6B7"
          width={150}
        />
      </View>
      <Text style={{ padding: "10%" }}>PLEASE DO NOT USE A PASSWORD YOU CARE ABOUT, USE ONLY FOR TESTING</Text>
      <View style={styles.buttonFlex}>
        <Button
          onPress={loginDemoAccount}
          title="Demo"
          color="#2FC6B7"
          width={150}
        />
        <View style={{ width: 20 }} />
        <Button
          onPress={() => { navigation.navigate("Home") } }
          title="Bypass"
          color="#2FC6B7"
          width={150}
        />
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#2FC6B7",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 35,
    paddingBottom: "1%",
  },
  form: {
    width: "100%",
    height: "87.5%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  input: {
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8'
  },
  buttonFlex: {
    flexDirection:"row",
    justifyContent: "center",
    marginTop: 10
  }
});

export default LoginScreen;
