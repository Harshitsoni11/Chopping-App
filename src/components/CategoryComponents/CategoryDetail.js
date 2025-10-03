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
  Platform,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useApp } from "../../context/AppContext";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";
import ProductDetailModal from "../ProductDetail/ProductDetailModal";

const { width } = Dimensions.get("window");

const CategoryDetail = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { products, addToCart, cartItemsCount, t, loading, error } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Calculate responsive bottom padding
  const getBottomPadding = () => {
    const tabBarHeight = 65; // Height of bottom tab bar
    const safeAreaBottom = insets.bottom;
    const totalBottomPadding = tabBarHeight + safeAreaBottom + 20; // Extra 20px for breathing room
    return totalBottomPadding;
  };

  const { categoryTitle = "Smoothie Packs", categoryId } = route.params || {};

  // Filter products by category only (simple, matches the mock)
  const sortedProducts = products
    .filter(product => (!categoryId || product.category === categoryTitle))
    .sort((a, b) => a.title.localeCompare(b.title));

  // Static fallback data to show immediately (matches mock)
  const staticProducts = [
    {
      id: "sp-1",
      title: "Berry Blast Mix",
      price: 14.9,
      image: "https://i.ibb.co/2nKz4VJ/berry.jpg",
      inStock: true,
    },
    {
      id: "sp-2",
      title: "Tropical Paraaia",
      price: 11.9,
      image: "https://picsum.photos/400/400?fruit7",
      inStock: true,
    },
    {
      id: "sp-3",
      title: "Green Detox",
      price: 14.9,
      image: "https://picsum.photos/400/400?fruit8",
      inStock: true,
    },
    {
      id: "sp-4",
      title: "Protein Smoothie Pack",
      price: 18.9,
      image: "https://picsum.photos/400/400?fruit9",
      inStock: true,
    },
  ];

  // Force static data to render to verify UI quickly
  const dataSource = staticProducts;

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      Alert.alert("Success", `${product.title} added to cart!`);
    } catch (err) {
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleProductPress(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.ctaButton, !item.inStock && styles.disabledButton]}
          onPress={(e) => {
            e.stopPropagation();
            if (item.inStock) {
              handleAddToCart(item);
            }
          }}
          disabled={!item.inStock}
        >
          <Text style={styles.ctaText}>{item.inStock ? "Add to Cart" : "Out of Stock"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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

      {/* Rounded Panel: Category header + grid (matches mock) */}
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Category </Text>
          <View style={styles.panelRight}>
            <Text style={styles.filterTextSimple}>{t('filter')}</Text>
            <Ionicons name="checkmark" size={18} color="#22C55E" style={{ marginLeft: 6 }} />
          </View>
        </View>
        {/* Products Grid */}
        <View style={styles.productsContainer}>
          <FlatList
            data={staticProducts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            initialNumToRender={4}
            removeClippedSubviews={false}
            style={styles.list}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={[styles.flatListContent, { paddingBottom: getBottomPadding(), flexGrow: 1 }]}
          />
        </View>
      </View>

      {/* Products Grid */}
      {/* <View style={styles.productsContainer}>
        <FlatList
          data={sortedProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={[styles.flatListContent, { paddingBottom: getBottomPadding() }]}
        />
      </View> */}

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={selectedProduct}
      />
    </SafeAreaView>
  );
};

export default CategoryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5F7",
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
  panel: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    overflow: "hidden",
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  panelRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterTextSimple: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  flatListContent: {
    // paddingBottom will be set dynamically
    
   marginHorizontal: 0,
  },
  list: {
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginVertical: 10,
    // exact width so two cards fit per row inside the rounded panel
    width: (width - 32 - 32 - 12) / 2, // screen - panel margins (32) - container padding (32) - gap (12)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
    display: "none",
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
    display: "none",
  },
  ctaButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  ctaText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
