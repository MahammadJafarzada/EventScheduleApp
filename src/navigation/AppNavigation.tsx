import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import EventAdd from '../screens/EventAdd';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventHistory from '../screens/EventHistory';
import { RootStackParamList } from '../../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
    return (
            <NavigationContainer>
                <Stack.Navigator
                    id={undefined}
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: true,
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#F9FAFB'
                        }
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="EventAdd"
                        component={EventAdd}
                        options={({ navigation }) => ({
                            title: 'Add Event',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Ionicons name="arrow-back" size={24} color="black" />
                                </TouchableOpacity>
                            )
                        })}
                    />
                    <Stack.Screen
                        name="EventHistory"
                        component={EventHistory}
                        options={({ navigation }) => ({
                            title: 'Event History',
                            headerLeft: () => (
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Ionicons name="arrow-back" size={24} color="black" />
                                </TouchableOpacity>
                            )
                        })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
    );
};

export default AppNavigation;