import React from 'react';
import { LoginScreen, SignUpScreen } from '../pages/auth';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createMaterialBottomTabNavigator();
const accentColor = 'purple';

const AuthStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="SignUp"
      labeled="true"
      shifting={false}
      activeColor="white"
      inactiveColor="#cf9af5"
      barStyle={{ backgroundColor: accentColor }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, _ }) => {
          let iconName;

          if (route.name === 'SignUp') {
            iconName = focused ? 'ios-person-add' : 'ios-person-add-outline';
          } else if (route.name === 'Login') {
            iconName = focused ? 'ios-log-in' : 'ios-log-in-outline';
          }
          return <Ionicons name={iconName} size={18} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="SignUp"
        component={SignUpScreen}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
      />
    </Tab.Navigator>
  );
};

module.exports = AuthStack;