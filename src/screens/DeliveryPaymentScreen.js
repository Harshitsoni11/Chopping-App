import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../context/AppContext";
import OrderSuccessModal from "../components/OrderDetail/OrderSuccessModal";

const { width } = Dimensions.get("window");

const DeliveryPaymentScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { cartTotal, deliveryFee, finalTotal, cartItemsCount } = useApp();
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("morning");
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const timeSlots = [
    { id: "morning", label: "Morning", time: "8:00 AM - 12:00 PM" },
    { id: "afternoon", label: "Afternoon", time: "12:00 PM - 4:00 PM" },
    { id: "evening", label: "Evening", time: "4:00 PM - 8:00 PM" },
    { id: "night", label: "Night", time: "8:00 PM - 10:00 PM" },
  ];

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: "card-outline" },
    { id: "upi", label: "UPI", icon: "phone-portrait-outline" },
    { id: "cod", label: "Cash on Delivery", icon: "cash-outline" },
    { id: "wallet", label: "Digital Wallet", icon: "wallet-outline" },
  ];

  const addresses = [
    { id: "home", label: "Home", address: "123 Main Street, City, State 12345" },
    { id: "office", label: "Office", address: "456 Business Ave, City, State 12345" },
  ];

  const handlePlaceOrder = () => {
    setShowSuccessModal(true);
  };

  const getBottomPadding = () => {
    const safeAreaBottom = insets.bottom;
    return safeAreaBottom + 20;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery & Payment</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
        <Text style={styles.progressText}>Step 3 of 4</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: getBottomPadding() }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>
                {addresses.find(addr => addr.id === selectedAddress)?.label} Address
              </Text>
              <Text style={styles.addressText}>
                {addresses.find(addr => addr.id === selectedAddress)?.address}
              </Text>
            </View>
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === slot.id && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTimeSlot(slot.id)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTimeSlot === slot.id && styles.selectedTimeSlotText
                ]}>
                  {slot.label}
                </Text>
                {selectedTimeSlot === slot.id && (
                  <Ionicons name="checkmark" size={16} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  selectedPayment === method.id && styles.selectedPaymentOption
                ]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <View style={styles.paymentLeft}>
                  <View style={[
                    styles.radioButton,
                    selectedPayment === method.id && styles.selectedRadioButton
                  ]}>
                    {selectedPayment === method.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Ionicons 
                    name={method.icon} 
                    size={20} 
                    color={selectedPayment === method.id ? "#4CAF50" : "#666"} 
                  />
                  <Text style={[
                    styles.paymentText,
                    selectedPayment === method.id && styles.selectedPaymentText
                  ]}>
                    {method.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
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
            <View style={[styles.summaryRow, styles.finalRow]}>
              <Text style={styles.finalLabel}>Final Amount</Text>
              <Text style={styles.finalValue}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Order Success Modal */}
      <OrderSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderDetails={{
          deliveryFee,
          paymentMethod: paymentMethods.find(method => method.id === selectedPayment)?.label,
          timeSlot: timeSlots.find(slot => slot.id === selectedTimeSlot)?.label,
        }}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 34,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B35",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  addressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  changeButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  selectedTimeSlot: {
    backgroundColor: "#E8F5E8",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginRight: 8,
  },
  selectedTimeSlotText: {
    color: "#4CAF50",
  },
  paymentContainer: {
    gap: 12,
  },
  paymentOption: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedPaymentOption: {
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadioButton: {
    borderColor: "#4CAF50",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  paymentText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  selectedPaymentText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  finalRow: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginTop: 8,
  },
  finalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  finalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  freeDeliveryText: {
    fontSize: 12,
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 8,
    fontStyle: "italic",
  },
  bottomContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  placeOrderButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DeliveryPaymentScreen;
