import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';


import Button from "../components/Button";

import FoodDictionary from "../utils/FoodDictionary";
import Edit from "../../assets/edit.svg";
import Delete from "../../assets/delete.svg";

import Wheat from "../../assets/wheat.svg";
import Dairy from "../../assets/dairy.svg";
import Fruit from "../../assets/fruit.svg";
import Meat from "../../assets/meat.svg";


const ProcessReceiptPhotoScreen = ({ route }) => {
    // route.params.text
    const navigation = useNavigation();

    // let detected_items = route.params.text.map(v => v.toLowerCase());
    let detected_items = ["yogurt", "rice", "bread", "beef", "cabbage", "ham", "yogurt", "yogurt"]

    var items = [];
    var count = 0;
    for (let i = 0; i < detected_items.length; i++) {
        for (const word of detected_items[i].split(/[ ,]+/)) {
            if (FoodDictionary[word] === undefined) {
                continue
            }
            items.push({
              id: count,
              name: FoodDictionary[word][0], 
              category: FoodDictionary[word][1], 
              qty: 1,
              price: 0,
              exp_date: null,
              loc: null,
            })
          count = count + 1;
        }
    }
    // console.log(items)
    
    const [foodData, setFoodData] = useState(items);
    // console.log(foodData)

    const deleteById = id => {
      setFoodData(oldValues => {
        return oldValues.filter(items => items.id !== id)
      })
    }

    const [modalVisible, setModalVisible] = useState(false);

    const [currentFood, setCurrentFood] = useState();

    const [name, setName] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [date, setDate] = useState(null)
    const [price, setPrice] = useState(0);

    const [locationOpen, setlocationOpen] = useState(false);
    const [locationValue, setlocationValue] = useState(null);
    const [locationItems, setlocationItems] = useState([
      {label: 'fridge', value: 'fridge'},
      {label: 'freezer', value: 'freezer'},
      {label: 'counter', value: 'counter'},
      {label: 'pantry', value: 'pantry'},
    ]);

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categoryValue, setCategoryValue] = useState(null);
    const [categoryItems, setCategoryItems] = useState([
      {label: 'produce', value: 'produce'},
      {label: 'meat', value: 'meat'},
      {label: 'dairy', value: 'dairy'},
      {label: 'grain', value: 'grain'}
    ]);

    const [currId, setCurrId] = useState(-1);

    const openModal = id => {
      setModalVisible(true);
      setCurrId(id)

      let curr = foodData.filter(items => items.id === id)[0]

      setCurrentFood(curr)
      setName(curr.name)
      setQuantity(curr.qty)
      setPrice(curr.price)
      setDate(curr.exp_date)
      setCategoryValue(curr.category)
      setlocationValue(curr.loc)
    }

    const finishModal = _ => {
      setModalVisible(!modalVisible);

      let newFoodData = (foodData)
      newFoodData.map((item) => {
        if (item.id == currId) {
          item.name = name
          item.category = categoryValue
          item.qty = quantity
          item.price = price
          item.exp_date = date
          item.loc = locationValue
        }
      })
      setFoodData(newFoodData)
    }
    const addEmptyFoodData = _ => {
      let emptyFoodData = {
        id: foodData.length + 1,
        name: "Empty", 
        category: "grain", 
        qty: 1,
        price: 0,
        exp_date: null,
        loc: null,
      }
      setFoodData([...foodData, emptyFoodData])
    }

    const sendFoodData = _ => {
      // David send the fooddata to the backend
      // here is an example what the foodData variable would look like:
      //   foodData = [
      //     {
      //       id: int,
      //       name: "string"
      //       category: "string",
      //       qty: int,
      //       price: int,
      //       exp_date: "string",
      //       loc: "string"
      //     },
      //     {
      //       id: int,
      //       name: "string"
      //       category: "string",
      //       qty: int,
      //       price: int,
      //       exp_date: "string",
      //       loc: "string"
      //     }
      //   ]
    }

    // console.log(categoryValue)
    return (
        <View style={styles.page}>
            <Text style={styles.title}>Review Items</Text>
            <View style={styles.form}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                
                  <View style={styles.modalView}>


                    <Text style={styles.formTitle}>form</Text>
                    <Text style={styles.formItemTitle}>item name:</Text>
                    <TextInput 
                      editable
                      maxLength={40}
                      value={name}
                      placeholder="enter an item name..."
                      onChangeText={setName}
                      autoCapitalize='none'
                      style={styles.textInput}
                    />
                    <Text style={styles.formItemTitle}>quantity:</Text>
                    <TextInput 
                      editable
                      maxLength={2}
                      value={quantity.toString()}
                      placeholder="enter quantity..."
                      onChangeText={setQuantity}
                      style={styles.textInput}
                      keyboardType="numeric"
                    />
                    <Text style={styles.formItemTitle}>price:</Text>
                    <TextInput 
                      editable
                      value={price.toString()}
                      placeholder="enter price..."
                      onChangeText={setPrice}
                      style={styles.textInput}
                      keyboardType="numeric"
                    />
                    <Text style={styles.formItemTitle}>expiration date:</Text>
                    <DatePicker 
                      date={date}
                      mode="date" //The enum of date, datetime and time
                      placeholder="-"
                      format="YYYY-MM-DD"
                      minDate={date}
                      confirmBtnText="confirm"
                      cancelBtnText="cancel"
                      onDateChange={(date) => {
                        setDate(date);
                      }}
                    />
                    <Text style={styles.formItemTitle}>category</Text>
                    <View style={styles.dropdownCtner1}>
                      <DropDownPicker
                        open={categoryOpen}
                        value={categoryValue}
                        items={categoryItems}
                        setOpen={setCategoryOpen}
                        setValue={setCategoryValue}
                        setcategoryItems={setCategoryItems}
                        placeholder="-"
                        style={{
                          backgroundColor: '#fafafa',
                          zIndex: 10,
                          position: 'relative',
                          borderColor: 'grey'
                        }}
                        dropDownContainerStyle={{zIndex:3000}}
                      />
                    </View>
                    <Text style={styles.formItemTitle}>location</Text>
                    <View style={styles.dropdownCtner2}>
                      <DropDownPicker
                        open={locationOpen}
                        value={locationValue}
                        items={locationItems}
                        setOpen={setlocationOpen}
                        setValue={setlocationValue}
                        setcategoryItems={setlocationItems}
                        placeholder="-"
                        style={{
                          backgroundColor: '#fafafa',
                          zIndex: 0,
                          position: 'relative',
                          borderColor: 'grey'
                        }}
                        dropDownContainerStyle={{zIndex:0}}
                      />
                    </View>

                    <View style={styles.margin} />
                    <Button 
                      onPress={() => {finishModal()}}
                      title="Done"
                      color="#2FC6B7"
                      width={103}
                      height={60}
                      fontSize={20}
                    />
                  </View>
                </View>
              </Modal>

              <ScrollView style={styles.form}>
                
                {foodData.map((item) => 
                  {
                    return (
                      <View style={styles.box}>
                        <View style={styles.margin} />
                        <View style={styles.row}>
                          
                          <View style={styles.content}>
                            {item.category == "grain" 
                              ? <View style={styles.logo}>
                                  <Wheat/>
                                </View>
                            
                              : 
                              item.category == "dairy"

                              ? <View style={[styles.logo, {backgroundColor: "#2FC6B7"}]}>
                                  <Dairy/>
                                </View>
                              : 
                              item.category == "produce"
                              ?
                              <View style={[styles.logo, {backgroundColor: "#FF9F1C"}]}>
                                <Fruit/>
                              </View>
                              :
                              <View style={[styles.logo, {backgroundColor: "#FFBF69"}]}>
                                <Meat/>
                              </View>
                            }
                            <View style={styles.food}>

                              <Text style={{fontSize: 25}}>{item.name}</Text>

                              <View style={styles.foodInfo}>
                                <View style={{width: "12%", height: "100%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                                  <View style={{backgroundColor: "#E5E5E5", width: "100%", height: "60%", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                                    {/* insert qty value */}
                                    <Text>{item.qty}</Text>
                                  </View>
                                  <Text style={{fontSize: 10}}>QTY</Text>
                                </View>
                                <View style={{width: "24%", height: "100%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                                  <View style={{backgroundColor: "#E5E5E5", width: "100%", height: "60%", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                                    {/* insert price value */}
                                    <Text>${item.price}</Text>
                                  </View>
                                  <Text style={{fontSize: 10}}>Price</Text>
                                </View>
                                <View style={{width: "45%", height: "100%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                                  <View style={{backgroundColor: "#ADEBE7", width: "100%", height: "60%", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                                    {/* insert expiration value */}
                                    {item.exp_date ? <Text>{item.exp_date}</Text> : <Text>MM-DD</Text>}
                                    
                                  </View>
                                  <Text style={{fontSize: 10}}>Expiration Date</Text>
                                </View>
                              </View>
                            </View>

                            <View style={styles.buttonBox}>
                              <TouchableOpacity style={styles.button} onPress={() => {openModal(item.id)}}>
                                <Edit width={29} height={29} />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.button} onPress={() => {deleteById(item.id)}}>
                                <Delete width={29} height={29} />
                              </TouchableOpacity>
                            </View>
                            

                          </View>
                          
                          <View style={styles.line} />
                        </View>
                      </View>
                    );
                  }
                )}
                <View style={styles.box}>
                  <View style={styles.margin} />
                  <View style={styles.row}>
                    
                    <View style={styles.content}>
                      <View style={[styles.logo, {backgroundColor: "#E5E5E5"}]}>
                      </View>

                      <View style={styles.food}>

                        <Text style={{fontSize: 25, color: "grey"}}>Add Item</Text>

                        <View style={styles.foodInfo}>
                          <View style={{width: "12%", height: "100%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                            <View style={{backgroundColor: "#E5E5E5", width: "100%", height: "60%", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                            </View>
                            {/* <Text style={{fontSize: 10}}>QTY</Text> */}
                          </View>
                          <View style={{width: "24%", height: "100%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                            <View style={{backgroundColor: "#E5E5E5", width: "100%", height: "60%", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                            </View>
                            {/* <Text style={{fontSize: 10}}>Price</Text> */}
                          </View>
                          <View style={{width: "45%", height: "100%", marginRight: "5%", justifyContent: "center", alignItems: "center"}}>
                            <View style={{backgroundColor: "#E5E5E5", width: "100%", height: "60%", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                            </View>
                            {/* <Text style={{fontSize: 10}}>Expiration Date</Text> */}
                          </View>
                        </View>
                      </View>

                      <View style={[styles.buttonBox, {justifyContent: "center", alignItems: "center"}]}>
                        <TouchableOpacity style={styles.button} onPress={() => {addEmptyFoodData()}}>
                          <AntDesign name="plus" size={36} color="grey" />
                        </TouchableOpacity>

                      </View>
                      

                    </View>
                    
                    <View style={styles.line} />
                  </View>
                </View>
                <View style={styles.margin} />
                <View style={{alignItems: "flex-end", width: "90%"}}>
                  <Button 
                    onPress={() => {sendFoodData()}}
                    title="Add All"
                    color="#2FC6B7"
                    width={103}
                    height={60}
                    fontSize={20}
                  />
                  <View style={styles.margin} />
                </View>
                
              </ScrollView>
              
            </View>
        </View>
      );
}

const styles = StyleSheet.create({  
  formItemTitle: {
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
dropdownCtner1: {
  zIndex: 3000
},
dropdownCtner2: {
  zIndex: 2000
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
},

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    height: "80%"
  },
  formTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center'
  },
  
  

    buttonBox: {
      width: "18.5%",
      height: "80%",
      flexDirection: 'row',
      alignItems: "flex-end",
      
    },
    button: {
      width: "50%",
      height: "50%",
      alignItems: "flex-end"

      // top: 0,
    },
    foodInfo: {
      width: "100%",
      height: "65%",
      flexDirection: 'row',
    },
    food: {
      width: "58%",
      height: "77%",
      marginLeft: "5%",
    },
    logo: {
      width: "18%",
      backgroundColor: "#ADEBE7",
      borderRadius: 20,
      height: "77%",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      // backgroundColor: "white",
      width: "90%",
      height: "100%",
      flexDirection: 'row',

      // justifyContent: "center",
    },
    row: {
      // backgroundColor: "grey",
      width: "100%",
      height: 90,
      // borderWidth: 1,
      alignItems: "center",
      justifyContent: "flex-end",

    },
    line: {
      width: "90%",
      height: 1,
      backgroundColor: "#D9D9D9",
      bottom: 0,
    },
    margin: {
      height: 21,
    },
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
      // alignItems: "center",
      // justifyContent: "center",
      backgroundColor: "#FFFFFF",
    }
  });

export default ProcessReceiptPhotoScreen