import React, { useCallback, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "./components/Button.js";
import Fridge from "../assets/fridge.svg";
import {
  NavigationHelpersContext,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { getUserSharedFridgeObject } from "./utils/HttpUtils.js";
import ItemList from "./ItemList.js";
import SortDropDown from "./SortDropDown";

const HouseBasketScreen = (navigation) => {
  const [houseData, setHouseData] = React.useState([]);
  const nav = useNavigation();
  const [selected, setSelected] = React.useState("");
  const sort_by = ["category", "expiration_date", "quantity", "location"];
  const location = ["fridge", "freezer", "counter", "pantry"];
  const category = ["produce", "meat", "dairy"];

  var inventory = [];
  useFocusEffect(
    useCallback(() => {
      getUserSharedFridgeObject().then((obj) => {
        var foods = obj.foods;
        // this is the food object, and is an array of object like this:
        // {"category":"produce","location":"fridge","name":"apple","quantity":1,"slug":"apple"}
        console.log("pushing foods: " + JSON.stringify(foods));
        setHouseData(foods);
      });
    }, [])
  );

  console.log(houseData);
  if (!houseData) {
    // shared fridge has not been created
    inventory = (
      <View style={styles.form}>
        <Button
          onPress={() => nav.push("CreateFridge")}
          title="Create Shared Fridge"
          color="#2FC6B7"
          width={300}
        />
      </View>
    );
  } else if (houseData.length == 0) {
    inventory = (
      <View style={styles.form}>
        <Fridge width={115} height={215} />
        <Text style={{ padding: "10%" }}>
          It looks like your shared fridge is empty.
        </Text>
        <Text style={{ padding: "10%", fontWeight: "bold" }}>
          Let's offer up some groceries!
        </Text>
      </View>
    );
  } else {
    inventory = (
      <ItemList
        sort={selected}
        data={houseData}
        location={location}
        category={category}
      />
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Shared Fridge</Text>
      <View style={styles.form}>
        <View style={styles.container}>
          <View style={styles.sort}>
            <SortDropDown sort={sort_by} setSelected={setSelected} />
          </View>
          {inventory}
          <Button
            onPress={() => nav.push("OfferUp")}
            title="Offer Up"
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
  sort: {
    position: "sticky",
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    maxHeight: "10%",
    position: "absolute",
    right: "2%",
    top: "5%",
    zIndex: 100, // brings to front
  },
  container: {
    flexDirection: "column",
    flex: 1,
    padding: "1%",
    width: "95%",
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
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    backgroundColor: "#FFFFFF",
  },
});

export default HouseBasketScreen;
