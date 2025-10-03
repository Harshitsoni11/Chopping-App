import React, { createContext, useContext, useReducer, useMemo } from 'react';

// Initial State
const initialState = {
  cart: [],
  user: {
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: "https://via.placeholder.com/80x80/4A90E2/FFFFFF?text=SJ",
    orders: 5,
    addresses: 2,
    language: "English",
  },
  products: [
    {
      id: "1",
      title: "Berry Blast Mix",
      price: 14.90,
      originalPrice: 19.90,
      image: "https://i.ibb.co/2nKz4VJ/berry.jpg",
      category: "Smoothie Packs",
      description: "Fresh mixed berries perfect for smoothies",
      inStock: true,
      rating: 4.5,
      reviews: 128,
    },
    {
      id: "2", 
      title: "Tropical Fruit Mix",
      price: 12.50,
      originalPrice: 15.00,
      image: "https://picsum.photos/400/400?fruit1",
      category: "Fresh Cut Fruits",
      description: "Exotic tropical fruits ready to eat",
      inStock: true,
      rating: 4.3,
      reviews: 95,
    },
    {
      id: "3",
      title: "Green Smoothie Pack",
      price: 9.99,
      originalPrice: 12.99,
      image: "https://picsum.photos/400/400?fruit2", 
      category: "Smoothie Packs",
      description: "Kale, spinach, and green apple mix",
      inStock: true,
      rating: 4.7,
      reviews: 203,
    },
    {
      id: "4",
      title: "Chopped Salad Mix",
      price: 8.50,
      originalPrice: 10.50,
      image: "https://picsum.photos/400/400?fruit3",
      category: "Salad Mixes", 
      description: "Fresh lettuce, tomatoes, and cucumbers",
      inStock: true,
      rating: 4.2,
      reviews: 87,
    },
    {
      id: "5",
      title: "Stir Fry Vegetables",
      price: 11.25,
      originalPrice: 13.75,
      image: "https://picsum.photos/400/400?fruit4",
      category: "Stir Fry Mixes",
      description: "Pre-cut vegetables for quick stir frying",
      inStock: true,
      rating: 4.4,
      reviews: 156,
    },
    {
      id: "6",
      title: "Soup Starter Pack",
      price: 7.99,
      originalPrice: 9.99,
      image: "https://picsum.photos/400/400?fruit5",
      category: "Soup Ingredients",
      description: "Onions, carrots, celery ready for soup",
      inStock: false,
      rating: 4.1,
      reviews: 73,
    }
  ],
  categories: [
    { id: "1", title: "FRESH CUT FRUITS", image: "https://picsum.photos/400/400?fruit1" },
    { id: "2", title: "CHOPPED VEGETABLES", image: "https://picsum.photos/400/400?fruit2" },
    { id: "3", title: "SALAD MIXES", image: "https://picsum.photos/400/400?fruit3" },
    { id: "4", title: "SMOOTHIE PACKS", image: "https://picsum.photos/400/400?fruit4" },
    { id: "5", title: "STIR FRY MIXES", image: "https://picsum.photos/400/400?fruit5" },
    { id: "6", title: "SOUP INGREDIENTS", image: "https://picsum.photos/400/400?fruit6" },
  ],
  loading: false,
  error: null,
};

// Action Types
export const ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  SET_LANGUAGE: 'SET_LANGUAGE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };

    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };

    case ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      };

    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        user: { ...state.user, language: action.payload },
      };

    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const addToCart = (product) => {
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };

  const setLoading = (loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };

  const updateUser = (userData) => {
    dispatch({ type: ACTIONS.UPDATE_USER, payload: userData });
  };

  // i18n: simple resources and helpers
  const translations = useMemo(() => ({
    English: {
      categories: 'Categories',
      searchCategories: 'Search categories...',
      cart: 'Cart',
      profile: 'Profile',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      products: 'Products',
      filter: 'Filter',
      shoppingCart: 'Shopping Cart',
      clearAll: 'Clear All',
      emptyCartTitle: 'Your cart is empty',
      emptyCartText: 'Add some fresh produce to get started!',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      total: 'Total',
      proceedToCheckout: 'Proceed to Checkout',
      buyNow: 'Buy Now',
      myProfile: 'My Profile',
      language: 'Language',
    },
    Hindi: {
      categories: 'श्रेणियाँ',
      searchCategories: 'श्रेणियाँ खोजें...',
      cart: 'कार्ट',
      profile: 'प्रोफ़ाइल',
      addToCart: 'कार्ट में जोड़ें',
      outOfStock: 'स्टॉक में नहीं',
      products: 'उत्पाद',
      filter: 'फ़िल्टर',
      shoppingCart: 'शॉपिंग कार्ट',
      clearAll: 'सब साफ करें',
      emptyCartTitle: 'आपकी कार्ट खाली है',
      emptyCartText: 'शुरू करने के लिए कुछ ताज़ा उत्पाद जोड़ें!',
      subtotal: 'उप-योग',
      deliveryFee: 'डिलिवरी शुल्क',
      total: 'कुल',
      proceedToCheckout: 'चेकआउट करें',
      buyNow: 'अभी खरीदें',
      myProfile: 'मेरा प्रोफ़ाइल',
      language: 'भाषा',
    },
  }), []);

  const setLanguage = (lang) => dispatch({ type: ACTIONS.SET_LANGUAGE, payload: lang });

  const t = (key) => {
    const lang = state.user.language || 'English';
    const table = translations[lang] || translations.English;
    return table[key] || key;
  };

  // Calculate cart totals
  const cartTotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = state.cart.reduce((count, item) => count + item.quantity, 0);
  const deliveryFee = cartTotal > 50 ? 0 : 4.99; // Free delivery over $50
  const finalTotal = cartTotal + deliveryFee;

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setLoading,
    setError,
    updateUser,
    setLanguage,
    t,
    cartTotal,
    cartItemsCount,
    deliveryFee,
    finalTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
