import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
// const CARD_WIDTH = width / 2 - 28;

const data = [
  {
    id: "1",
    title: "Berry Blast Mix",
    price: "$14,90",
    image: "https://i.ibb.co/2nKz4VJ/berry.jpg",
  },
  {
    id: "2",
    title: "Berry Blast Mix",
    price: "$14,90",
    image: "https://i.ibb.co/2nKz4VJ/berry.jpg",
  },
  {
    id: "3",
    title: "Berry Blast Mix",
    price: "$14,90",
    image: "https://i.ibb.co/2nKz4VJ/berry.jpg",
  },
  {
    id: "4",
    title: "Berry Blast Mix",
    price: "$14,90",
    image: "https://i.ibb.co/2nKz4VJ/berry.jpg",
  },
  {
    id: "5",
    title: "Berry Blast Mix",
    price: "$14,90",
    image: "https://i.ibb.co/2nKz4VJ/berry.jpg",
  },
  {
    id: "6",
    title: "Berry Blast Mix",
    price: "$14,90",
    image: "https://picsum.photos/400/400?fruit1",
  },
  {
    id: "7",
    title: "Berry Blast Mix",
    price: "$14,90",
    image: "https://picsum.photos/400/400?fruit1",
  },
  {
    id: "8",
    title: "Berry Blast Mix",
    price: "$14,90",
    image: "https://picsum.photos/400/400?fruit1",
  },
];

const CategoryDetail = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
        <Text style={styles.headerText}>Smoothie Packs</Text>
        <View style={styles.headerUnderline} />
        </View>
        <View style={styles.icons}>
          <Ionicons name="search-outline" size={24} color="black" />
          <View style={{ marginLeft: 16 }}>
            <Ionicons name="cart-outline" size={26} color="black" />
            <View style={styles.redDot} />
          </View>
        </View>
      </View>

      {/* Category Row */}
      <View style={{flex:1,backgroundColor:"#fff",padding:16,borderStyle:"solid",borderWidth:1,borderColor:"#ddd",borderRadius:30,width:"90%",alignSelf:"center",gap:18}}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>Category</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.filterText}>Filter</Text>
              <MaterialIcons name="check" size={18} color="green" />
            </View>
          </View>

          {/* Products Grid */}
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
      </View>
    </SafeAreaView>
  );
};

export default CategoryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
    width: width
  },
  
  header: {
    marginTop: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    padding:10
  },
  headerText: {
    fontSize: 26,
    fontWeight: "700",
  },
  headerUnderline: {
    height: 3,
    width: 50,
    backgroundColor: "green",
    marginTop: 4,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    position: "absolute",
    top: -2,
    right: -2,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    width: "100%",
    height: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
