import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  // SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import TrackOrderModal from './TrackOrderModal';


const { width, height } = Dimensions.get('window');

const OrderSuccessModal = ({ visible, onClose, orderDetails }) => {
  const navigation = useNavigation();
  const { cart, finalTotal, clearCart } = useApp();
  const insets = useSafeAreaInsets();
  const [trackVisible, setTrackVisible] = useState(false);

  const handleTrackOrder = () => {
    setTrackVisible(true);
  };

  const handleContinueShopping = () => {
    onClose();
    clearCart(); // Clear cart after successful order
    navigation.navigate('Home');
  };

  const generateOrderId = () => {
    return `#ORD${Math.floor(Math.random() * 90000) + 10000}`;
  };

  const getDeliveryTime = () => {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    return deliveryTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container] }>
        {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Order Placed Successfully!</Text>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={24} color="#fff" />
            </View>
          </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Order ID */}
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>{generateOrderId()}</Text>
            <View style={styles.deliveryTimeTag}>
              <Text style={styles.deliveryTimeText}>
                Today {getDeliveryTime()} - {new Date(new Date().getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </Text>
            </View>
          </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressTabs}>
                <View style={[styles.progressTab, styles.activeTab]}>
                  <Text style={[styles.progressTabText, styles.activeTabText]}>Confirmed</Text>
                  <View style={styles.activeIndicator} />
                </View>
                <View style={styles.progressTab}>
                  <Text style={styles.progressTabText}>Processing</Text>
                </View>
                <View style={styles.progressTab}>
                  <Text style={styles.progressTabText}>Out for Delivery</Text>
                </View>
              </View>
              <Text style={styles.orderIdText}>Order {generateOrderId()}</Text>
            </View>

          <View style={styles.addressContainer}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressInfo}>
                <Ionicons name="location-outline" size={20} color="#4CAF50" />
                <View style={styles.addressTextContainer}>
                  <Text style={styles.addressText}>123 Main Street, City, State 12345</Text>
                  <Text style={styles.addressSubText}>Home Address</Text>
                </View>
              </View>
              <Text style={styles.deliveryFee}>${orderDetails?.deliveryFee || 4.99}</Text>
            </View>
          </View>

          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.productImagesContainer}>
              {cart.slice(0, 4).map((item, index) => (
                <Image
                  key={item.id}
                  source={{ uri: item.image }}
                  style={[
                    styles.productImage,
                    { zIndex: cart.length - index }
                  ]}
                />
              ))}
              {cart.length > 4 && (
                <View style={[styles.productImage, styles.moreItemsOverlay]}>
                  <Text style={styles.moreItemsText}>+{cart.length - 4}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Payment Method</Text>
              <Text style={styles.paymentMethod}>{orderDetails?.paymentMethod || 'UPI'}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.trackOrderButton} onPress={handleTrackOrder}>
              <Text style={styles.trackOrderText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueShoppingButton} onPress={handleContinueShopping}>
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
      </SafeAreaView>

      <TrackOrderModal
      visible={trackVisible}
      onClose={() => setTrackVisible(false)}
      onGoHome={() => {
        setTrackVisible(false);
        const parentNav = navigation.getParent ? navigation.getParent() : null;
        if (parentNav) parentNav.navigate('Home');
        else navigation.navigate('Home');
      }}
      generateOrderId={generateOrderId}
      getDeliveryTime={getDeliveryTime}
    />
    </Modal>
    {/* Separate Track Order Modal */}
  
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
  },
  trackContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  trackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  trackHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  successIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderIdContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  deliveryTimeTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  deliveryTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    position: 'relative',
  },
  progressTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  addressContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addressSubText: {
    fontSize: 14,
    color: '#666',
  },
  deliveryFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryContainer: {
    marginBottom: 30,
  },
  productImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreItemsOverlay: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position:"relative",
    bottom:0,
  },
  trackOrderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  trackOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueShoppingButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  continueShoppingText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  statusText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  statusDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  trackFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  trackHomeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  trackHomeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OrderSuccessModal;
