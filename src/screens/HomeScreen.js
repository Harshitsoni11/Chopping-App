import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AutoScrollSlider from "../components/AutoScrollSlider";


const { width } = Dimensions.get("window");

const HomeScreen = () => (
  <View style={styles.container}>
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color="#888"
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Search"
        placeholderTextColor="#888"
        style={styles.searchBox}
      />
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Top Categories */}
      <AutoScrollSlider />

      {/* Fresh Cut Fruits */}
      <Text style={styles.sectionTitle}>Fresh Cut Fruits</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Image
          style={styles.imageCard}
          source={{ uri: "https://picsum.photos/400/400?fruit1" }}
        />
        <Image
          style={styles.imageCard}
          source={{ uri: "https://picsum.photos/400/400?fruit2" }}
        />
        <Image
          style={styles.imageCard}
          source={{ uri: "https://picsum.photos/400/400?fruit3" }}
        />
      </ScrollView>

      {/* Chopped Vegetables */}
      <Text style={styles.sectionTitle}>Chopped Vegetables</Text>
      <View style={styles.grid}>
        {["Choped Mixes", "Salad Mixes", "Smoothie Packs"].map((name, i) => (
          <View key={i} style={styles.gridItem}>
            <Image
              style={styles.gridImage}
              source={{ uri: `https://picsum.photos/400/40${i}` }}
            />
            <Text style={styles.gridText}>{name}</Text>
          </View>
        ))}
      </View>

      {/* Smoothie Packs */}
      <Text style={styles.sectionTitle}>Smoothie Packs</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Image
          style={styles.imageCard}
          source={{ uri: "https://picsum.photos/400/400?smoothie1" }}
        />
        <Image
          style={styles.imageCard}
          source={{ uri: "https://picsum.photos/400/400?smoothie2" }}
        />
        <Image
          style={styles.imageCard}
          source={{ uri: "https://picsum.photos/400/400?smoothie3" }}
        />
      </ScrollView>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", padding: 10 },
  backArrow: { fontSize: 22, marginRight: 10 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 5,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  topCategories: { paddingHorizontal: 10, marginVertical: 10 },
  topCategoryCard: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 100,
    alignItems: "center",
  },
  topCategoryText: { fontSize: 14, fontWeight: "600" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginTop: 20,
  },
  imageCard: {
    width: width * 0.5,
    height: 140,
    borderRadius: 15,
    margin: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  gridItem: { width: width / 3 - 15, alignItems: "center", marginVertical: 10 },
  gridImage: { width: "100%", height: 90, borderRadius: 10, marginBottom: 5 },
  gridText: { fontSize: 14, textAlign: "center" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: "#333",
  },
});

export default HomeScreen;
