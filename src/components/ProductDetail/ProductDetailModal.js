import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';

const { width, height } = Dimensions.get('window');

const ProductDetailModal = ({ visible, onClose, product }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { addToCart, cartItemsCount } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    // Add multiple quantities to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const handleBuyNow = () => {
    // Add to cart and navigate to cart screen
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
    // Navigate to cart screen first
    navigation.navigate('Cart');
  };

  const getBottomPadding = () => {
    const safeAreaBottom = insets.bottom;
    return safeAreaBottom;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.cartIcon}>
              <Image 
                source={{ uri: product.image }} 
                style={styles.cartPreviewImage}
              />
              {cartItemsCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Product Title */}
          <Text style={styles.productTitle}>{product.title}</Text>
          
          {/* Product Description */}
          <Text style={styles.productDescription}>{product.description}</Text>
          
          {/* Key Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Ready to cook</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="time-outline" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Stays fresh for 3 days</Text>
            </View>
          </View>

          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
          </View>

          {/* Price and Options */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={styles.optionsContainer}>
              <View style={styles.optionTag}>
                <Text style={styles.optionText}>$40g</Text>
              </View>
              <View style={styles.optionTag}>
                <Text style={styles.optionText}>20g</Text>
              </View>
              <View style={styles.optionTag}>
                <Text style={styles.optionText}>4K</Text>
              </View>
            </View>
          </View>

          {/* Nutrition Info */}
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionLabel}>Nutrition:</Text>
            <View style={styles.nutritionItems}>
              <View style={styles.nutritionItem}>
                <Ionicons name="leaf-outline" size={16} color="#4CAF50" />
                <Text style={styles.nutritionText}>Actiers</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Ionicons name="bag-outline" size={16} color="#4CAF50" />
                <Text style={styles.nutritionText}>Malgors</Text>
              </View>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color="#666" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}>
                <Ionicons name="add" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Text style={styles.buyNowText}>Buy Now</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIcon: {
    position: 'relative',
    marginRight: 15,
  },
  cartPreviewImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationIcon: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  productImage: {
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  optionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  nutritionContainer: {
    marginBottom: 30,
  },
  nutritionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  nutritionItems: {
    flexDirection: 'row',
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  nutritionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailModal;