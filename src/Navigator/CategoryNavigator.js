import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CategoryScreen from '../screens/CategoryScreen';
import CategoryDetail from '../components/CategoryComponents/CategoryDetail';
const Stack = createNativeStackNavigator();

function CategoryNavigator() {
  return (
 <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Category" component={CategoryScreen} />
     <Stack.Screen name="CategoryDetail" component={CategoryDetail}  options={{ 
      tabBarStyle: { display: "none" } 
    }}/>
  </Stack.Navigator>
  )
}

export default CategoryNavigator;
