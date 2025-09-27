import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useApp } from "../../context/AppContext";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

const { width } = Dimensions.get("window");

const CategoryDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { products, addToCart, cartItemsCount, loading, error } = useApp();
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");

  const { categoryTitle = "Products", categoryId } = route.params || {};

  // Filter products by category
  const filteredProducts = products.filter(product => {
    const matchesCategory = !categoryId || product.category === categoryTitle;
    const matchesFilter = filterBy === "all" || 
      (filterBy === "inStock" && product.inStock) ||
      (filterBy === "onSale" && product.originalPrice > product.price);
    return matchesCategory && matchesFilter;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      Alert.alert("Success", `${product.title} added to cart!`);
    } catch (err) {
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, !item.inStock && styles.disabledButton]}
          onPress={() => item.inStock && handleAddToCart(item)}
          disabled={!item.inStock}
        >
          <Text style={styles.buttonText}>
            {item.inStock ? "Add to Cart" : "Out of Stock"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerText}>{categoryTitle}</Text>
            <View style={styles.headerUnderline} />
          </View>
        </View>
        <View style={styles.icons}>
          <Ionicons name="search-outline" size={24} color="black" />
          <TouchableOpacity 
            style={styles.cartIcon}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={26} color="black" />
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter and Sort */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <TouchableOpacity
            style={[styles.filterButton, filterBy === "all" && styles.activeFilter]}
            onPress={() => setFilterBy("all")}
          >
            <Text style={[styles.filterText, filterBy === "all" && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterBy === "inStock" && styles.activeFilter]}
            onPress={() => setFilterBy("inStock")}
          >
            <Text style={[styles.filterText, filterBy === "inStock" && styles.activeFilterText]}>In Stock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterBy === "onSale" && styles.activeFilter]}
            onPress={() => setFilterBy("onSale")}
          >
            <Text style={[styles.filterText, filterBy === "onSale" && styles.activeFilterText]}>On Sale</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "name" && styles.activeSort]}
            onPress={() => setSortBy("name")}
          >
            <Text style={[styles.sortText, sortBy === "name" && styles.activeSortText]}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "price-low" && styles.activeSort]}
            onPress={() => setSortBy("price-low")}
          >
            <Text style={[styles.sortText, sortBy === "price-low" && styles.activeSortText]}>Price ↑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === "price-high" && styles.activeSort]}
            onPress={() => setSortBy("price-high")}
          >
            <Text style={[styles.sortText, sortBy === "price-high" && styles.activeSortText]}>Price ↓</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      <View style={styles.productsContainer}>
        <FlatList
          data={sortedProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerUnderline: {
    height: 3,
    width: 50,
    backgroundColor: "#4CAF50",
    marginTop: 4,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartIcon: {
    marginLeft: 16,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  filterContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
    color: "#333",
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: "#4CAF50",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
    color: "#333",
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  activeSort: {
    backgroundColor: "#4CAF50",
  },
  sortText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  activeSortText: {
    color: "#fff",
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 6,
    width: (width - 60) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
    color: "#333",
  },
  reviews: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
