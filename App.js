import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AppProvider } from "./src/context/AppContext";
import HomeNavigator from "./src/Navigator/HomeNavigator";
import CategoryNavigator from "./src/Navigator/CategoryNavigator";
import CartScreen from "./src/screens/CartScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <AppProvider>
      <SafeAreaView style={styles.container}>
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
              tabBarActiveTintColor: "#4CAF50",
              tabBarInactiveTintColor: "#999",
              tabBarStyle: {
                backgroundColor: "white",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: "hidden",
                position: "absolute",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
                height: 65,
                paddingBottom: 5,
                paddingTop: 5,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeNavigator} />
            <Tab.Screen 
              name="Categories" 
              component={CategoryNavigator}
              options={({ route }) => {
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
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
