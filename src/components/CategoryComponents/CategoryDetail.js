import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

const  CategoryDetail = ({ route }) => {

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={item.image}
        style={styles.image}
        imageStyle={{ borderRadius: 15 }}
      >
        <Text style={styles.title}>{item.title}</Text>
      </ImageBackground> */}
      <Text style={styles.title}>Helllo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "90%", height: 200, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
});

export default CategoryDetail;