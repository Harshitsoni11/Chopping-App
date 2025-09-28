import React, { useState } from "react";
import { View, Text, FlatList, ImageBackground, TouchableOpacity, StyleSheet, TextInput, Keyboard, Platform } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Color from "../constants/color";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const CategoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { categories, loading, error } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate responsive bottom padding
  const getBottomPadding = () => {
    const tabBarHeight = 65; // Height of bottom tab bar
    const safeAreaBottom = insets.bottom;
    const totalBottomPadding = tabBarHeight + safeAreaBottom + 20; // Extra 20px for breathing room
    return totalBottomPadding;
  };

  // Filter categories by search query
  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Loading categories..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <Text style={styles.heading}>Categories</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search categories..."
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery("");
                Keyboard.dismiss();
              }}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.flatListContent, { paddingBottom: getBottomPadding() }]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            accessible={true}
            accessibilityLabel={`Category: ${item.title}`}
            onPress={() => navigation.navigate('CategoryDetail', { 
              categoryTitle: item.title,
              categoryId: item.id 
            })}
          >
            <ImageBackground
              source={item.image}
              style={styles.image}
              resizeMode="cover"
              imageStyle={{ borderRadius: 15 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.cardText}>{item.title}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.cardbackground,
  },
  header: {
    padding: 15,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
  },
  flatListContent: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 16,
    marginHorizontal: 8,
    width: "44%",
    height: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 12,
    justifyContent: "flex-end",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default CategoryScreen;