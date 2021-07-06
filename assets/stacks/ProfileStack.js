import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../pages/profile';
import ProfileUpdateScreen from '../pages/profile_update';

const Stack = createStackNavigator();

export default ProfileStack = () => {
    return (
        <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen
                name="Profile"
                options={{headerShown: false}}
                component={ProfileScreen}
            />
            <Stack.Screen
                name="Update Profile"
                component={ProfileUpdateScreen}
            />
        </Stack.Navigator>
    );
};