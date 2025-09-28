import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/CartScreen';
import DeliveryPaymentScreen from '../screens/DeliveryPaymentScreen';

const Stack = createNativeStackNavigator();

function CartNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="DeliveryPayment" component={DeliveryPaymentScreen} />
    </Stack.Navigator>
  );
}

export default CartNavigator;
