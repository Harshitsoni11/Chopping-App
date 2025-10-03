import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal,Image, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TrackOrderModal = ({ visible, onClose, onGoHome, generateOrderId, getDeliveryTime }) => {
  const insets = useSafeAreaInsets();
  const orderId = generateOrderId?.() || '#ORD12345';
  const timeWindow = getDeliveryTime?.() ? `Today ${getDeliveryTime?.()} - ${new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}` : 'Today 2-4 PM';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      hardwareAccelerated={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}} edges={['top','bottom']}>
        {/* Fixed Header */}
        <View style={[styles.headerContainer, { paddingTop: 8 + insets.top }]}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Order Tracking</Text>
              <Text style={styles.orderId}>{orderId}</Text>
              <Text style={styles.time}>{timeWindow}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.roundIconBtn}>
              <Ionicons name="close" size={18} color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.container} 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          overScrollMode="never"
          bounces={false}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{ padding: 20, paddingBottom: 120 + insets.bottom, flexGrow: 1 }}
        >

          {/* Order Status (timeline) */}
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.timelineWrapper}>
            <View style={styles.timeline} />
            <View style={styles.statusList}>
              <StatusItem label="Order Confirmed" checked />
              <StatusItem label="Order Processing" checked time="02:12 PM" />
              <StatusItem label="Out for Delivery" progress={1} time="02:21 PM" />
              <StatusItem label="Delivered" />
            </View>
          </View>

          {/* Order Summary */}
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryImages}>
              <Image source={{ uri: "https://via.placeholder.com/80" }} style={styles.itemImg} />
              <Image source={{ uri: "https://via.placeholder.com/80" }} style={styles.itemImg} />
              <Image source={{ uri: "https://via.placeholder.com/80" }} style={styles.itemImg} />
            </View>
            <View>
              <Text style={styles.price}>$24.8</Text>
              <Text style={styles.priceSub}>12.6</Text>
            </View>
          </View>

          {/* Delivery Person */}
          <View style={styles.deliveryHeader}>
            <Text style={styles.sectionTitle}>Delivery Person</Text>
            <Text style={styles.etaText}>10 min</Text>
          </View>
          <View style={styles.deliveryCard}>
            <Ionicons name="person-circle-outline" size={50} color="#333" />
            <View>
              <Text style={styles.deliveryName}>Your Dangs</Text>
              <Text style={styles.deliveryRole}>Delivery Person</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.shareBtn}>
              <Ionicons name="share-social-outline" size={18} color="#333" />
              <Text style={{ marginLeft: 5 }}>Share Tracking details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportBtn}>
              <Text style={styles.supportText}>Support</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Fixed Footer */}
        <View style={[styles.footerBar, { paddingBottom: 10 + insets.bottom }]}>
          <TouchableOpacity style={styles.homeBtn} onPress={onGoHome}>
            <Text style={styles.homeBtnText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  orderId: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginTop: 4,
  },
  time: {
    fontSize: 14,
    color: "#333",
    marginTop: 6,
  },
  icon: {
    marginTop: 4,
  },
  roundIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#111",
  },
  timelineWrapper: {
    position: "relative",
    paddingLeft: 28,
    marginBottom: 16,
  },
  timeline: {
    position: "absolute",
    left: 10,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  statusList: {
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  statusText: {
    fontSize: 16,
  },
  timeSmall: {
    fontSize: 12,
    color: "#888",
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f7f7f7",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryImages: {
    flexDirection: "row",
  },
  itemImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  priceSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "right",
  },
  deliveryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  etaText: {
    color: "#555",
  },
  deliveryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  deliveryName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deliveryRole: {
    fontSize: 14,
    color: "#888",
  },
  callBtn: {
    marginLeft: "auto",
    backgroundColor: "#FF6B35",
    padding: 10,
    borderRadius: 30,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  supportBtn: {
    backgroundColor: "#FF6B35",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  supportText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footerBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  homeBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 0,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  homeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TrackOrderModal;

function StatusItem({ label, checked, time, progress }) {
  return (
    <View style={styles.statusItem}>
      {checked ? (
        <Ionicons name="checkmark-circle" size={20} color="green" />
      ) : progress ? (
        <Ionicons name="bicycle-outline" size={20} color="orange" />
      ) : (
        <Ionicons name="ellipse-outline" size={20} color="#bbb" />
      )}
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.statusText}>{label}</Text>
        {time && <Text style={styles.timeSmall}>{time}</Text>}
      </View>
    </View>
  );
}


