import * as React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createFridge } from './utils/HttpUtils.js';
import AsyncStorage from "@react-native-async-storage/async-storage";


const CreateFridge = () => {
  const navigation = useNavigation();
  const [name, setName] = React.useState(null);

  async function submit() {
    alert('this is the name: ' + name)
    const email = await AsyncStorage.getItem("user_email")
    createFridge(email, name)
    navigation.goBack()
  }
  return (
    <View style={styles.container}>
      <Text style={styles.form}>fridge name:</Text>
      <TextInput 
        editable
        maxLength={40}
        value={name}
        placeholder="enter fridge name..."
        onChangeText={setName}
        autoCapitalize='none'
        style={styles.textInput}
      />
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.text}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: '10%',
  },
  formTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center'
  },
  form: {
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 10
  },
  textInput: {
    color: 'black',
    padding: 13,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: 'grey'
  },
  btn: {
    backgroundColor: '#2FC6B7',
    justifyContent: "center",
    borderRadius: 10,
    width: 100,
    alignSelf: 'center',
    padding: 10,
    margin: 20
  },
  text: {
    fontSize: 20,
    color: "#FFFFFF",
    alignSelf: "center",
  }
})


export default CreateFridge;