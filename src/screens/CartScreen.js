import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Image,
  Alert,
  Dimensions,
  Platform
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ProductDetailModal from "../components/ProductDetail/ProductDetailModal";

const { width, height } = Dimensions.get("window");

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { 
    cart, 
    cartTotal, 
    cartItemsCount, 
    deliveryFee, 
    finalTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    loading,
    error,
    t,
  } = useApp();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Calculate responsive bottom padding
  const getBottomPadding = () => {
    const tabBarHeight = 65; // Height of bottom tab bar
    const safeAreaBottom = insets.bottom;
    const totalBottomPadding = tabBarHeight + safeAreaBottom - 33; // Extra 20px for breathing room
    return totalBottomPadding;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checkout.");
      return;
    }
    
    // Navigate to delivery & payment screen
    navigation.navigate('DeliveryPayment');
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearCart }
      ]
    );
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading cart..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('shoppingCart')}</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>{t('clearAll')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyCartTitle}>{t('emptyCartTitle')}</Text>
          <Text style={styles.emptyCartText}>{t('emptyCartText')}</Text>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {cart.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.cartItem}
                onPress={() => handleProductPress(item)}
              >
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)} each</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.id, item.quantity - 1);
                      }}
                    >
                      <Ionicons name="remove" size={16} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.id, item.quantity + 1);
                      }}
                    >
                      <Ionicons name="add" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <Text style={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Order Summary */}
          <View style={[styles.orderSummary, { marginBottom: getBottomPadding() }]}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('subtotal')} ({cartItemsCount} items)</Text>
              <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('deliveryFee')}</Text>
              <Text style={styles.summaryValue}>
                {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
              </Text>
            </View>
            {deliveryFee > 0 && (
              <Text style={styles.freeDeliveryText}>
                Add ${(50 - cartTotal).toFixed(2)} more for free delivery!
              </Text>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelBold}>{t('total')}</Text>
              <Text style={styles.summaryTotal}>${finalTotal.toFixed(2)}</Text>
            </View>

            <View style={styles.checkoutButtonsContainer}>
              <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>{t('proceedToCheckout')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.buyNowBtn} 
                onPress={() => navigation.navigate('DeliveryPayment')}
              >
                <Text style={styles.buyNowText}>{t('buyNow')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={selectedProduct}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f9f9f9" 
  },
  header: { 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15, 
    borderBottomWidth: 1, 
    borderColor: "#ddd", 
    backgroundColor: "#fff" 
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: "bold",
    color: "#333"
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FF6B6B",
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  scrollContainer: { 
    padding: 15,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemPrice: { 
    fontSize: 14, 
    color: "#666",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  removeButton: {
    padding: 8,
  },
  orderSummary: { 
    padding: 20, 
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 8 
  },
  summaryLabel: { 
    fontSize: 14, 
    color: "#666" 
  },
  summaryLabelBold: { 
    fontSize: 16, 
    fontWeight: "bold",
    color: "#333"
  },
  summaryValue: { 
    fontSize: 14, 
    fontWeight: "600",
    color: "#333"
  },
  summaryTotal: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: "#4CAF50"
  },
  freeDeliveryText: {
    fontSize: 12,
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 8,
    fontStyle: "italic",
  },
  checkoutButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  checkoutBtn: { 
    flex: 1,
    backgroundColor: "#4CAF50", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center", 
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkoutText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  buyNowBtn: {
    flex: 1,
    backgroundColor: "#FF6B35", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buyNowText: {
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});