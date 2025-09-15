import React, { useRef, useEffect, useState } from "react";
import { ScrollView, Image, Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

const images = [
  "https://picsum.photos/id/1018/600/400",
  "https://picsum.photos/id/1015/600/400",
  "https://picsum.photos/id/1019/600/400",
];

const AutoScrollSlider = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔑 Responsive sizes
  const IMAGE_WIDTH = width * 0.95; // 95% of screen width
  const IMAGE_HEIGHT = width * 0.5; // half of screen width
  const SPACING = width * 0.04; // 4% of screen width

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
      scrollRef.current.scrollTo({
        x: (IMAGE_WIDTH + SPACING) * nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={{ height: IMAGE_HEIGHT , marginVertical: 10 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={IMAGE_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: (width - IMAGE_WIDTH) / 2, // centers first & last
        }}
      >
        {images.map((uri, index) => (
        <View key={index} style={[styles.card, { width: IMAGE_WIDTH, height: IMAGE_HEIGHT, marginRight: SPACING }]}>
          <Image
            key={index}
            source={{uri}}
            style={{
              borderRadius: 12,
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              resizeMode: "cover",
            }}
          />
        </View>
        ))}
       
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
    card: {
      borderRadius: 12,
      backgroundColor: "#fff",
      // iOS Shadow
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      // Android Shadow
      elevation: 6,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 12,
      resizeMode: "cover",
    },
  });

export default AutoScrollSlider;
