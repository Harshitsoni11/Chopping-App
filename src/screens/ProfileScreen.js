import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useApp } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, updateUser, setLanguage, t, loading, error } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
  });
  const [selectedLanguage, setSelectedLanguage] = useState(user.language || "English");

  // Calculate responsive bottom padding
  const getBottomPadding = () => {
    const tabBarHeight = 65; // Height of bottom tab bar
    const safeAreaBottom = insets.bottom;
    const totalBottomPadding = tabBarHeight + safeAreaBottom + 20; // Extra 20px for breathing room
    return totalBottomPadding;
  };

  const menuItems = [
    { id: 1, title: "My Orders", icon: "📦", action: "orders" },
    { id: 2, title: "Saved Addresses", icon: "📄", action: "addresses" },
    { id: 3, title: "Payment Methods", icon: "💳", action: "payment" },
    { id: 4, title: "Notifications", icon: "🔔", action: "notifications" },
    { id: 5, title: "Help & Support", icon: "❓", action: "support" },
    { id: 6, title: "About Us", icon: "ℹ️", action: "about" },
    { id: 7, title: "Language", icon: "🌐", action: "language" },
  ];

  const handleMenuPress = (action) => {
    switch (action) {
      case "orders":
        Alert.alert("My Orders", "View your order history");
        break;
      case "addresses":
        Alert.alert("Saved Addresses", "Manage your delivery addresses");
        break;
      case "payment":
        Alert.alert("Payment Methods", "Manage your payment methods");
        break;
      case "notifications":
        Alert.alert("Notifications", "Configure your notification preferences");
        break;
      case "support":
        Alert.alert("Help & Support", "Get help and support");
        break;
      case "about":
        Alert.alert("About Us", "Learn more about our app");
        break;
      case "language":
        setLanguageModalVisible(true);
        break;
      default:
        Alert.alert("Coming Soon", "This feature is coming soon!");
    }
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handlePickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to select a profile picture.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        updateUser({ avatar: uri });
        Alert.alert('Success', 'Profile picture updated.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSaveProfile = () => {
    if (editForm.name.trim() && editForm.email.trim()) {
      updateUser(editForm);
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  const handleSaveLanguage = () => {
    setLanguage(selectedLanguage);
    setLanguageModalVisible(false);
    Alert.alert(t('language'), `${selectedLanguage}`);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          Alert.alert("Logged Out", "You have been logged out successfully!");
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={[styles.scrollView, { paddingBottom: getBottomPadding() }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('myProfile')}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
            <TouchableOpacity style={styles.avatarEditBtn} onPress={handlePickAvatar}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* User Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>User Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="bag-outline" size={24} color="#4CAF50" />
              <Text style={styles.statText}>{user.orders} Orders</Text>
            </View>
            <View style={[styles.statCard, styles.statCardGreen]}>
              <Ionicons name="location-outline" size={24} color="#4CAF50" />
              <Text style={styles.statText}>{user.addresses} Addresses</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.action)}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuText}>{item.action === 'language' ? t('language') : item.title}</Text>
              </View>
              {item.action === "language" ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.languageValue}>{selectedLanguage}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style= {{height:80}}></View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.name}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, name: text })
                }
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={editForm.email}
                onChangeText={(text) =>
                  setEditForm({ ...editForm, email: text })
                }
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>

            <TouchableOpacity
              style={[styles.languageOption, selectedLanguage === "English" && styles.languageOptionActive]}
              onPress={() => setSelectedLanguage("English")}
            >
              <Text style={styles.languageText}>English</Text>
              {selectedLanguage === "English" && <Ionicons name="checkmark" size={18} color="#4CAF50" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.languageOption, selectedLanguage === "Hindi" && styles.languageOptionActive]}
              onPress={() => setSelectedLanguage("Hindi")}
            >
              <Text style={styles.languageText}>Hindi</Text>
              {selectedLanguage === "Hindi" && <Ionicons name="checkmark" size={18} color="#4CAF50" />}
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLanguageModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveLanguage}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  editButton: {
    padding: 5,
  },
  editIcon: {
    fontSize: 18,
    color: "#000",
  },
  userInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  socialIcon: {
    display: 'none',
  },
  socialIconText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
  },
  statCardGreen: {
    backgroundColor: "#E8F5E8",
    borderColor: "#4CAF50",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    color: "#666",
  },
  menuText: {
    fontSize: 16,
    color: "#000",
  },
  languageValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 6,
  },
  chevron: {
    fontSize: 20,
    color: "#ccc",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  languageOptionActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  languageText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
});

export default ProfileScreen;
