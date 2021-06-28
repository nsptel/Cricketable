import React from 'react';
import { LoginScreen, SignUpScreen } from '../pages/auth';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator>
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
        </Stack.Navigator>
    );
};

module.exports = AuthStack;