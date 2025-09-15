import React from "react";
import { View, Text, FlatList, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import Color from "../constants/Color";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const categories = [
  { id: "1", title: "FRESH CUT FRUITS", image: { uri: "https://picsum.photos/400/400?fruit1" } },
  { id: "2", title: "CHOPPED VEGETABLES", image: { uri: "https://picsum.photos/400/400?fruit2" } },
  { id: "3", title: "SALAD MIXES", image: { uri: "https://picsum.photos/400/400?fruit3" } },
  { id: "4", title: "SMOOTHIE PACKS", image: { uri: "https://picsum.photos/400/400?fruit4" } },
  { id: "5", title: "STIR FRY MIXES", image: { uri: "https://picsum.photos/400/400?fruit5" } },
  { id: "6", title: "SOUP INGREDIENTS", image: { uri: "https://picsum.photos/400/400?fruit6" } },
  { id: "7", title: "SOUP INGREDIENTS", image: { uri: "https://picsum.photos/400/400?fruit7" } },
  { id: "8", title: "SOUP INGREDIENTS", image: { uri: "https://picsum.photos/400/400?fruit8" } },
  { id: "9", title: "SOUP INGREDIENTS", image: { uri: "https://picsum.photos/400/400?fruit9" } },
  { id: "10", title: "SOUP INGREDIENTS", image: { uri: "https://picsum.photos/400/400?fruit10" } },
  { id: "11", title: "SOUP INGREDIENTS", image: { uri: "https://picsum.photos/400/400?fruit10" } },
  { id: "12", title: "SOUP INGREDIENTS", image: { uri: "https://picsum.photos/400/400?fruit10" } },
  { id: "13", title: "SOUP INGREDIENTS", image: { uri: "https://picsum.photos/400/400?fruit10" } },
];

const CategoryScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style= {{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={styles.heading}>Categories</Text> 
        <Ionicons name="search" size={25} color="#888" style={{marginRight:10}} />
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false} // Hide scrollbar
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            accessible={true}
            accessibilityLabel={`Category: ${item.title}`}
            onPress={() => navigation.navigate('CategoryDetail')}
          >
            <ImageBackground
              source={item.image}
              style={styles.image}
              resizeMode="cover"
              imageStyle={{ borderRadius: 15 }}
            >
              <Text style={styles.cardText}>{item.title}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Color.cardbackground,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 8, // Add horizontal gap between cards
    width: "44%", // Adjust width to account for the margin
    height: 200, // Fixed height for the card
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden", // Ensure content doesn't overflow the card
},
image: {
    width: "100%",
    height: "100%", // Ensure the image covers the entire card
    justifyContent: "flex-end", // Align text at the bottom
    alignItems: "center", // Center the text horizontally
},
cardText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    // textAlign: "center",
    padding: 8, // Add padding around the text
    width: "100%", // Ensure the text background spans the full width
},
});

export default CategoryScreen;