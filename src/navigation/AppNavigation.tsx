import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Home from '../screens/Home';

const AppNavigation = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();

    return (
    <NavigationContainer>
        <Stack.Navigator id={undefined} screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation