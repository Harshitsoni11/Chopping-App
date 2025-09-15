import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeNavigator from "./src/Navigator/HomeNavigator";
import CategoryNavigator from "./src/Navigator/CategoryNavigator";
import CartScreen from "./src/screens/CartScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const { width } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back + Search */}

      {/* Bottom Navigation */}
      <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = "home-outline";
            else if (route.name === "Categories") iconName = "grid-outline";
            else if (route.name === "Cart") iconName = "cart-outline";
            else if (route.name === "Profile") iconName = "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "white",
            borderTopLeftRadius: 20, // Rounded top-left corner
            borderTopRightRadius: 20, // Rounded top-right corner
            overflow: "hidden", // Prevent content overflow
            position: "absolute", // Ensure proper positioning
            shadowColor: "#000", // Shadow color
          },
          
        })}
      >
        <Tab.Screen name="Home" component={HomeNavigator} />
       <Tab.Screen name="Categories" component={CategoryNavigator}
        options={({ route }) => {
          // 👇 Hide tab bar on CategoryDetail
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Category";
          if (routeName === "CategoryDetail") {
            return { tabBarStyle: { display: "none" } };
          }
          return {};
        }}
       />
       <Tab.Screen name="Cart" component={CartScreen} /> 
        <Tab.Screen name="Profile" component={ProfileScreen} /> 
      </Tab.Navigator>
    </NavigationContainer>
    </SafeAreaView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
