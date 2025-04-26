import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import categoryScreen from './src/screens/categoryScreen';
import productDetailsScreen from './src/screens/productDetailsScreen';
import productListScreen from './src/screens/productListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='category'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name='category'
          component={categoryScreen}
        />
        <Stack.Screen
          name='prodDetails'
          component={productDetailsScreen}
        />
        <Stack.Screen
          name='prodList'
          component={productListScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}