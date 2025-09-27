import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Image,
  Alert,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const { width } = Dimensions.get("window");

export default function CartScreen() {
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
    error 
  } = useApp();

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
    
    Alert.alert(
      "Checkout", 
      `Total: $${finalTotal.toFixed(2)}\n\nProceed to payment?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Pay Now", 
          onPress: () => {
            Alert.alert("Success!", "Order placed successfully!");
            clearCart();
          }
        }
      ]
    );
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
        <Text style={styles.headerText}>Shopping Cart</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>Add some fresh produce to get started!</Text>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)} each</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
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
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({cartItemsCount} items)</Text>
              <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
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
              <Text style={styles.summaryLabelBold}>Total</Text>
              <Text style={styles.summaryTotal}>${finalTotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    marginBottom: 50,
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
  checkoutBtn: { 
    backgroundColor: "#4CAF50", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 10,
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
});