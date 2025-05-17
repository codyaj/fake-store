import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './src/slices/authSlice';

import categoryScreen from './src/screens/categoryScreen';
import productDetailsScreen from './src/screens/productDetailsScreen';
import productListScreen from './src/screens/productListScreen';
import cartScreen from './src/screens/cartScreen';
import loginScreen from './src/screens/loginScreen';
import signupScreen from './src/screens/signupScreen';
import profileScreen from './src/screens/profileScreen';

const Stack = createStackNavigator();

export default function App() {
  function AppStartupHandler() {
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(logout());
    }, []);
  
    return null;
  }

  return (
    <Provider store={store}>
      <AppStartupHandler />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName='login'
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
          <Stack.Screen
            name='shopCart'
            component={cartScreen}
          />
          <Stack.Screen 
            name='login'
            component={loginScreen}
          />
          <Stack.Screen 
            name='signup'
            component={signupScreen}
          />
          <Stack.Screen 
            name='profile'
            component={profileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}