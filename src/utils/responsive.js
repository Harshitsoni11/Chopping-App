import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Responsive design utilities
export const responsive = {
  // Screen dimensions
  width,
  height,
  
  // Responsive breakpoints
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 414,
  isLargeDevice: width >= 414,
  
  // Responsive sizing
  wp: (percentage) => (width * percentage) / 100,
  hp: (percentage) => (height * percentage) / 100,
  
  // Font scaling
  fontScale: (size) => {
    const scale = width / 375; // Base width for scaling
    return Math.max(size * scale, size * 0.8); // Minimum 80% of original size
  },
  
  // Safe area calculations
  getBottomPadding: (insets) => {
    const tabBarHeight = 65; // Height of bottom tab bar
    const safeAreaBottom = insets.bottom;
    const extraPadding = Platform.OS === 'android' ? 10 : 20; // Android needs less padding
    return tabBarHeight + safeAreaBottom + extraPadding;
  },
  
  // Platform-specific adjustments
  getPlatformPadding: () => {
    return Platform.OS === 'android' ? 10 : 20;
  },
  
  // Screen size categories
  getScreenSize: () => {
    if (width < 375) return 'small';
    if (width < 414) return 'medium';
    return 'large';
  },
  
  // Responsive grid columns
  getGridColumns: () => {
    if (width < 375) return 1;
    if (width < 600) return 2;
    return 3;
  },
  
  // Card dimensions
  getCardWidth: (columns = 2, margin = 16) => {
    const totalMargin = margin * (columns + 1);
    return (width - totalMargin) / columns;
  },
  
  // Button heights
  getButtonHeight: () => {
    return Platform.OS === 'android' ? 48 : 44;
  },
  
  // Input heights
  getInputHeight: () => {
    return Platform.OS === 'android' ? 48 : 44;
  }
};

// Hook for responsive bottom padding
export const useResponsiveBottomPadding = () => {
  const insets = useSafeAreaInsets();
  return responsive.getBottomPadding(insets);
};

// Hook for responsive dimensions
export const useResponsiveDimensions = () => {
  return {
    width,
    height,
    isSmallDevice: responsive.isSmallDevice,
    isMediumDevice: responsive.isMediumDevice,
    isLargeDevice: responsive.isLargeDevice,
    screenSize: responsive.getScreenSize(),
    gridColumns: responsive.getGridColumns(),
  };
};

export default responsive;
