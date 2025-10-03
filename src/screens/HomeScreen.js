import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Keyboard,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import AutoScrollSlider from "../components/AutoScrollSlider";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ProductDetailModal from "../components/ProductDetail/ProductDetailModal";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { products, loading, error, addToCart, setError, t } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Calculate responsive bottom padding
  const getBottomPadding = () => {
    const tabBarHeight = 65; // Height of bottom tab bar
    const safeAreaBottom = insets.bottom;
    const totalBottomPadding = tabBarHeight + safeAreaBottom + 20; // Extra 20px for breathing room
    return totalBottomPadding;
  };

  // Filter products by search query
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group products by category
  const productsByCategory = {
    "Fresh Cut Fruits": products.filter(p => p.category === "Fresh Cut Fruits"),
    "Smoothie Packs": products.filter(p => p.category === "Smoothie Packs"),
    "Salad Mixes": products.filter(p => p.category === "Salad Mixes"),
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      Alert.alert("Success", `${product.title} added to cart!`);
    } catch (err) {
      setError("Failed to add item to cart");
    }
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderProductCard = (product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>${product.price}</Text>
          {product.originalPrice > product.price && (
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews})</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, !product.inStock && styles.disabledButton]}
          onPress={(e) => {
            e.stopPropagation();
            if (product.inStock) {
              handleAddToCart(product);
            }
          }}
          disabled={!product.inStock}
        >
          <Text style={styles.addButtonText}>
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner message="Loading fresh produce..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => setError(null)} />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search fresh produce..."
          placeholderTextColor="#888"
          style={styles.searchBox}
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: getBottomPadding() }]}>
        {/* Auto Scroll Slider */}
        <AutoScrollSlider />

        {/* Search Results */}
        {searchQuery.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>
              Search Results ({filteredProducts.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredProducts.map(renderProductCard)}
            </ScrollView>
          </View>
        ) : (
          <>
            {/* Fresh Cut Fruits */}
            {productsByCategory["Fresh Cut Fruits"].length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Fresh Cut Fruits</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {productsByCategory["Fresh Cut Fruits"].map(renderProductCard)}
                </ScrollView>
              </>
            )}

            {/* Category Grid */}
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.grid}>
              {["Chopped Mixes", "Salad Mixes", "Smoothie Packs"].map((name, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate('Categories')}
                >
                  <Image
                    style={styles.gridImage}
                    source={{ uri: `https://picsum.photos/400/40${i}` }}
                  />
                  <Text style={styles.gridText}>{name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Smoothie Packs */}
            {productsByCategory["Smoothie Packs"].length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Smoothie Packs</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {productsByCategory["Smoothie Packs"].map(renderProductCard)}
                </ScrollView>
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={selectedProduct}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  scrollContent: { 
    // paddingBottom will be set dynamically
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginVertical: 10,
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
  searchBox: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  productCard: {
    width: width * 0.45,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  currentPrice: {
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
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  gridItem: { 
    width: width / 3 - 20, 
    alignItems: "center", 
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 10,
  },
  gridImage: { 
    width: "100%", 
    height: 80, 
    borderRadius: 8, 
    marginBottom: 8 
  },
  gridText: { 
    fontSize: 12, 
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
});

export default HomeScreen;
