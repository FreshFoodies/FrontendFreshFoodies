import React, { Component, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  LogBox,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";

import Wheat from "../assets/wheat.svg";
import Dairy from "../assets/dairy.svg";
import Fruit from "../assets/fruit.svg";
import Meat from "../assets/meat.svg";

function ItemList(props) {
  LogBox.ignoreAllLogs();

  const navigation = useNavigation();
  // create inventory
  let inventory = {};
  let sortCategoryList = [];
  let sort = props.sort ? props.sort : "category"; // if props sort is undefined - default is category

  if (sort == "category" || sort == "location") {
    // create the lists of each
    for (let i = 0; i < props[sort].length; i++) {
      let sortName = props[sort][i];
      sortCategoryList.push(sortName);
      inventory[sortName] = [];
    }

    // add the items into the lists
    for (let i = 0; i < props.data.length; i++) {
      let item = props.data[i];
      // if (typeof item == 'undefined') {continue;}
      try {
        inventory[item[sort]].push(item);
      } catch (error) {
        continue;
      }
    }
  } else if (sort == "expiration_date") {
    sortCategoryList.push(
      "Expired",
      "Expiring today",
      "Expiring the next two days",
      "Expiring within two weeks",
      "Expiring later this month",
      "Expiring in month+"
    );
    let date = new Date();

    // create lists of each
    for (let i = 0; i < sortCategoryList.length; i++) {
      let sortName = sortCategoryList[i];
      inventory[sortName] = [];
    }
    // add items into the list
    for (let i = 0; i < props.data.length; i++) {
      let item = props.data[i];
      let curr = new Date(props.data[i].expiration_date); // current item's date of expiration
      let dateDiff = Math.trunc((curr - date) / (1000 * 3600 * 24)); // finding date diff

      // finding the right sort
      let sortName = "";
      if (dateDiff < 0) sortName = "Expired";
      else if (dateDiff == 0) sortName = "Expiring today";
      else if (dateDiff <= 2) sortName = "Expiring the next two days";
      else if (dateDiff <= 14) sortName = "Expiring within two weeks";
      else if (dateDiff <= 30) sortName = "Expiring later this month";
      else sortName = "Expiring in month+";

      // pushing it into inventory!
      inventory[sortName].push(item);
    }
  } else if (sort == "quantity") {
    let quantitySort = props.data;
    quantitySort.sort(function (b, a) {
      return b.quantity - a.quantity;
    });
    sortCategoryList.push("Quantity");
    inventory["Quantity"] = [];
    for (let i = 0; i < quantitySort.length; i++) {
      inventory["Quantity"].push(quantitySort[i]);
    }
  }

  // now produce it onto the inventory
  const [selectedItems, setSelectedItems] = React.useState([]);
  const getSelected = (contact) => selectedItems.includes(contact.id);

  function handlePress(item) {
    if (selectedItems.includes(item.slug)) {
      const newListItems = selectedItems.filter(
        (listItem) => listItem !== item.slug
      );
      setSelectedItems([...newListItems]);
    } else {
      setSelectedItems([...selectedItems, item.slug]);
    }

    if (!props.foodArray.includes(item)) {
      //checking weather array contain the id
      props.foodArray.push(item); //adding to array because value doesnt exists
    } else {
      props.foodArray.splice(props.foodArray.indexOf(item), 1); //deleting
    }
  }

  const ListItem = ({ item, selected, onPress }) => {
    console.log(item);
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        key={item.name + "_item"}
        style={
          selectedItems.includes(item.name)
            ? [styles.item, { borderWidth: 3, borderColor: "#2FC6B7" }]
            : styles.item
        }
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: "15%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AntDesign name="up" size={24} color="#2FC6B7" />
            <Text
              style={[
                styles.item_info_detail,
                { backgroundColor: "white", borderWidth: 0 },
              ]}
              key={item.name + "_ctnr_quantity_count"}
            >
              {item.quantity}
            </Text>
            <AntDesign name="down" size={24} color="#2FC6B7" />
          </View>

          {/* {item.category == "Grain" 
          ? 
            <Wheat/>
          : 
          item.category == "Dairy"

          ? 
            <Dairy/>
          : 
          item.category == "Produce"
          ?
          <Fruit/>
          :
          <Meat/>
        } */}
          <View
            style={{
              marginLeft: "3%",
              width: "50%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }} key={item.name + "_item_text"}>
              {item.name}
            </Text>
          </View>
          <View
            style={{
              width: "25%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={[
                styles.item_info_detail,
                {
                  width: "95%",
                  backgroundColor: "#ADEBE7",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={[
                  styles.item_info_detail,
                  { width: "95%", backgroundColor: "#ADEBE7", borderWidth: 0 },
                ]}
                key={item.name + "_ctnr_exp_date_date"}
              >
                {item.expiration_date}
              </Text>
            </View>
            <Text
              style={styles.item_info_title}
              key={item.name + "_ctnr_exp_date_text"}
            >
              Expiration Date
            </Text>
          </View>
        </View>
        {/* <Text style={{ fontSize: 20 }} key={item.name + "_item_text"}>
        {item.name}
      </Text>
      <View style={styles.item_info} key={item.name + "_item_info"}>
        <View style={styles.info_container} key={item.name + "_ctnr_quantity"}>
          <Text
            style={styles.item_info_detail}
            key={item.name + "_ctnr_quantity_count"}
          >
            {item.quantity}
          </Text>
          <Text
            style={styles.item_info_title}
            key={item.name + "_ctnr_quantity_text"}
          >
            quantity
          </Text>
        </View>
        <View style={styles.info_container} key={item.name + "_ctnr_exp_date"}>
          <Text
            style={styles.item_info_detail}
            key={item.name + "_ctnr_exp_date_date"}
          >
            {item.expiration_date}
          </Text>
          <Text
            style={styles.item_info_title}
            key={item.name + "_ctnr_exp_date_text"}
          >
            expiration date
          </Text>
        </View>
      </View> */}
      </TouchableOpacity>
    );
  };

  var inventoryContainer = [];
  for (let i = 0; i < sortCategoryList.length; i++) {
    let currSort = sortCategoryList[i];
    if (inventory[currSort].length > 0) {
      inventoryContainer.push(
        <Text style={styles.category_title} key={"sort_" + currSort}>
          {currSort}
        </Text>
      );
      var items = [];
      inventoryContainer.push(
        <FlatList
          data={inventory[currSort]}
          renderItem={({ item }) => {
            return (
              <ListItem
                onPress={() => handlePress(item)}
                item={item}
                selected={getSelected(item)}
              />
            );
          }}
          keyExtractor={(item) => item.slug}
          scrollEnabled={false}
          // numColumns={1}
        />
      );
      inventoryContainer.push(
        <View
          style={styles.items_container}
          key={"items_container_" + currSort}
        >
          {items}
        </View>
      );
    }
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {inventoryContainer}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "10%",
    marginTop: "2%",
  },
  items_container: {
    paddingTop: "1%",
    paddingBottom: "3%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    margin: "1%",
    backgroundColor: "white",
    width: "95%",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D9D9D9",
    shadowColor: "grey",
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    overflow: "hidden",
  },
  itemClicked: {
    margin: "1%",
    backgroundColor: "white",
    width: "48%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#2FC6B7",
    shadowColor: "grey",
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    overflow: "hidden",
  },
  category_title: {
    fontSize: 25,
    paddingTop: "2%",
  },
  item_info: {
    flexDirection: "row",
  },
  info_container: {
    alignItems: "center",
    paddingTop: "5%",
    paddingRight: "5%",
    paddingLeft: "5%",
  },
  item_info_detail: {
    backgroundColor: "#ECECEC",
    padding: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ECECEC",
    overflow: "hidden",
  },
  item_info_title: {
    fontSize: 10,
  },
  empty: {
    paddingTop: "5%",
    textAlign: "center",
    fontSize: 18,
    marginTop: 0,
    width: "100%",
  },
});

export default ItemList;
